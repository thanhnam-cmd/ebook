module.exports = {
  apps: [
    {
      name: 'dangtri-ebook-store',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/dangtri.com/app',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
