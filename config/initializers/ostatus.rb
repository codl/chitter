# frozen_string_literal: true

port  = ENV.fetch('PORT') { 3000 }
host  = ENV.fetch('LOCAL_DOMAIN') { "localhost:#{port}" }
web_host = ENV.fetch('WEB_DOMAIN') { host }
https = ENV['LOCAL_HTTPS'] == 'true'

Rails.application.configure do
  config.x.local_domain = host
  config.x.web_domain   = web_host
  config.x.use_https    = https
  config.x.use_s3       = ENV['S3_ENABLED'] == 'true'

  config.action_mailer.default_url_options = { host: web_host, protocol: https ? 'https://' : 'http://', trailing_slash: false }
  config.x.streaming_api_base_url          = 'http://localhost:4000'

  if Rails.env.production?
    config.action_cable.allowed_request_origins = ["http#{https ? 's' : ''}://#{web_host}"]
    config.x.streaming_api_base_url             = ENV.fetch('STREAMING_API_BASE_URL') { "http#{https ? 's' : ''}://#{web_host}" }
  end
end
