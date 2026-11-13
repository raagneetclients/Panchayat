declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    ADMIN_REVIEWER_EMAILS?: string;
    BUCKET?: R2Bucket;
  }
}
