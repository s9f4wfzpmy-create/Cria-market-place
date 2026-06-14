use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkgm4YFhjK7SH");

const MAX_NAME_LEN: usize = 32;
const REGISTRY_SPACE: usize = 8 + Registry::INIT_SPACE;
const BUCKET_SPACE: usize = 8 + Bucket::INIT_SPACE;

#[program]
pub mod onchain_rate_limiter {
    use super::*;

    pub fn initialize_registry(
        ctx: Context<InitializeRegistry>,
        name: String,
        default_window_seconds: i64,
    ) -> Result<()> {
        require!(!name.is_empty(), RateLimitError::NameRequired);
        require!(name.as_bytes().len() <= MAX_NAME_LEN, RateLimitError::NameTooLong);
        require!(default_window_seconds > 0, RateLimitError::InvalidWindow);

        let registry = &mut ctx.accounts.registry;
        registry.authority = ctx.accounts.authority.key();
        registry.default_window_seconds = default_window_seconds;
        registry.name = fixed_name(&name);
        registry.created_at = Clock::get()?.unix_timestamp;
        registry.bump = ctx.bumps.registry;

        Ok(())
    }

    pub fn create_bucket(
        ctx: Context<CreateBucket>,
        subject: Pubkey,
        limit: u32,
        window_seconds: Option<i64>,
    ) -> Result<()> {
        require!(limit > 0, RateLimitError::InvalidLimit);

        let registry = &ctx.accounts.registry;
        let selected_window = window_seconds.unwrap_or(registry.default_window_seconds);
        require!(selected_window > 0, RateLimitError::InvalidWindow);

        let now = Clock::get()?.unix_timestamp;
        let bucket = &mut ctx.accounts.bucket;
        bucket.registry = registry.key();
        bucket.subject = subject;
        bucket.limit = limit;
        bucket.remaining = limit;
        bucket.window_seconds = selected_window;
        bucket.window_started_at = now;
        bucket.updated_at = now;
        bucket.bump = ctx.bumps.bucket;

        Ok(())
    }

    pub fn consume(ctx: Context<Consume>, units: u32) -> Result<()> {
        require!(units > 0, RateLimitError::InvalidConsumption);

        let now = Clock::get()?.unix_timestamp;
        let bucket = &mut ctx.accounts.bucket;

        if now.saturating_sub(bucket.window_started_at) >= bucket.window_seconds {
            bucket.window_started_at = now;
            bucket.remaining = bucket.limit;
        }

        require!(bucket.remaining >= units, RateLimitError::QuotaExceeded);

        bucket.remaining = bucket
            .remaining
            .checked_sub(units)
            .ok_or(RateLimitError::QuotaExceeded)?;
        bucket.updated_at = now;

        emit!(QuotaConsumed {
            registry: bucket.registry,
            subject: bucket.subject,
            units,
            remaining: bucket.remaining,
            window_started_at: bucket.window_started_at,
        });

        Ok(())
    }

    pub fn reconfigure_bucket(
        ctx: Context<ReconfigureBucket>,
        new_limit: u32,
        new_window_seconds: i64,
    ) -> Result<()> {
        require!(new_limit > 0, RateLimitError::InvalidLimit);
        require!(new_window_seconds > 0, RateLimitError::InvalidWindow);

        let now = Clock::get()?.unix_timestamp;
        let bucket = &mut ctx.accounts.bucket;
        bucket.limit = new_limit;
        bucket.remaining = new_limit;
        bucket.window_seconds = new_window_seconds;
        bucket.window_started_at = now;
        bucket.updated_at = now;

        emit!(BucketReconfigured {
            registry: bucket.registry,
            subject: bucket.subject,
            limit: bucket.limit,
            window_seconds: bucket.window_seconds,
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitializeRegistry<'info> {
    #[account(
        init,
        payer = authority,
        space = REGISTRY_SPACE,
        seeds = [b"registry", authority.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub registry: Account<'info, Registry>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(subject: Pubkey)]
pub struct CreateBucket<'info> {
    #[account(
        has_one = authority,
        seeds = [b"registry", authority.key().as_ref(), registry.name_bytes()],
        bump = registry.bump
    )]
    pub registry: Account<'info, Registry>,
    #[account(
        init,
        payer = authority,
        space = BUCKET_SPACE,
        seeds = [b"bucket", registry.key().as_ref(), subject.as_ref()],
        bump
    )]
    pub bucket: Account<'info, Bucket>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Consume<'info> {
    #[account(
        mut,
        seeds = [b"bucket", bucket.registry.as_ref(), subject.key().as_ref()],
        bump = bucket.bump,
        constraint = bucket.subject == subject.key() @ RateLimitError::UnauthorizedSubject
    )]
    pub bucket: Account<'info, Bucket>,
    pub subject: Signer<'info>,
}

#[derive(Accounts)]
pub struct ReconfigureBucket<'info> {
    #[account(
        has_one = authority,
        seeds = [b"registry", authority.key().as_ref(), registry.name_bytes()],
        bump = registry.bump
    )]
    pub registry: Account<'info, Registry>,
    #[account(
        mut,
        seeds = [b"bucket", registry.key().as_ref(), bucket.subject.as_ref()],
        bump = bucket.bump,
        constraint = bucket.registry == registry.key() @ RateLimitError::RegistryMismatch
    )]
    pub bucket: Account<'info, Bucket>,
    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Registry {
    pub authority: Pubkey,
    pub default_window_seconds: i64,
    pub name: [u8; MAX_NAME_LEN],
    pub created_at: i64,
    pub bump: u8,
}

impl Registry {
    pub fn name_bytes(&self) -> &[u8] {
        let end = self.name.iter().position(|b| *b == 0).unwrap_or(MAX_NAME_LEN);
        &self.name[..end]
    }
}

#[account]
#[derive(InitSpace)]
pub struct Bucket {
    pub registry: Pubkey,
    pub subject: Pubkey,
    pub limit: u32,
    pub remaining: u32,
    pub window_seconds: i64,
    pub window_started_at: i64,
    pub updated_at: i64,
    pub bump: u8,
}

#[event]
pub struct QuotaConsumed {
    pub registry: Pubkey,
    pub subject: Pubkey,
    pub units: u32,
    pub remaining: u32,
    pub window_started_at: i64,
}

#[event]
pub struct BucketReconfigured {
    pub registry: Pubkey,
    pub subject: Pubkey,
    pub limit: u32,
    pub window_seconds: i64,
}

#[error_code]
pub enum RateLimitError {
    #[msg("Registry name is required.")]
    NameRequired,
    #[msg("Registry name must fit within 32 bytes.")]
    NameTooLong,
    #[msg("Window duration must be positive.")]
    InvalidWindow,
    #[msg("Limit must be greater than zero.")]
    InvalidLimit,
    #[msg("Consumption units must be greater than zero.")]
    InvalidConsumption,
    #[msg("The requested quota exceeds the remaining window allowance.")]
    QuotaExceeded,
    #[msg("Only the bucket subject can consume from this bucket.")]
    UnauthorizedSubject,
    #[msg("Bucket is not attached to this registry.")]
    RegistryMismatch,
}

fn fixed_name(name: &str) -> [u8; MAX_NAME_LEN] {
    let mut bytes = [0_u8; MAX_NAME_LEN];
    bytes[..name.as_bytes().len()].copy_from_slice(name.as_bytes());
    bytes
}
