export const fakeEnv = function () {
  const env = {
    NODE_ENV: 'production',
    PORT: 443,
    DATABASE_URL: 'mongodb://localhost:27017/what-the-hack',
    JWT_SECRET: 'stupid#foolish*idiotic@#$silly%dumb^unintelligent&brainless(mindless)senseless~moronic|imbecile!dim-witted;half-witted$inane+thick-headed{witless}doltish<fatuous>asinine',
    JWT_EXPIRES_IN: '1d',
    JWT_COOKIE_EXPIRES_IN: 1,
    JWT_COOKIE_SECURE: true,
    JWT_COOKIE_HTTP_ONLY: true,
    JWT_COOKIE_SAME_SITE: 'strict',

    EMAIL_HOST: 'qwertyuiopasdfghjklz.abcdefghijklmnopqrstuvwxyabcdefghi.com',
    EMAIL_PORT: 465,
    EMAIL_USER: 'yheB5mF3qP8zTk2Rn6Vo',
    EMAIL_PASSWORD: 'Xj4WvQ7bU2aNs8dLr9TgIuO1cKyEzQwMp'
  }

  return Object.keys(env).map(key => `${key}=${env[key as keyof typeof env]}`).join('\n')
}