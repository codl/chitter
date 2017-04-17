# frozen_string_literal: true

class Auth::SessionsController < Devise::SessionsController
  include Devise::Controllers::Rememberable

  layout 'auth'

  skip_before_action :require_no_authentication, only: [:create]
  prepend_before_action :authenticate_with_two_factor, if: :two_factor_enabled?, only: [:create]

  def create
    super do |resource|
      remember_me(resource)
      flash[:notice] = nil
    end
  end

  def destroy
    super
    flash[:notice] = nil
  end

  protected

  def find_user
    if session[:otp_user_id]
      User.find(session[:otp_user_id])
    elsif user_params[:email]
      User.find_by(email: user_params[:email])
    end
  end

  def user_params
    params.require(:user).permit(:email, :password, :otp_attempt)
  end

  def after_sign_in_path_for(_resource)
    last_url = stored_location_for(:user)

    if [about_path].include?(last_url)
      root_path
    else
      last_url || root_path
    end
  end

  def two_factor_enabled?
    find_user.try(:otp_required_for_login?)
  end

  def valid_otp_attempt?(user)
    user.validate_and_consume_otp!(user_params[:otp_attempt]) ||
      user.invalidate_otp_backup_code!(user_params[:otp_attempt])
  end

  def authenticate_with_two_factor
    user = self.resource = find_user

    if user_params[:otp_attempt].present? && session[:otp_user_id]
      authenticate_with_two_factor_via_otp(user)
    elsif user && user.valid_password?(user_params[:password])
      prompt_for_two_factor(user)
    end
  end

  def authenticate_with_two_factor_via_otp(user)
    if valid_otp_attempt?(user)
      session.delete(:otp_user_id)
      remember_me(user)
      sign_in(user)
    else
      flash.now[:alert] = I18n.t('users.invalid_otp_token')
      prompt_for_two_factor(user)
    end
  end

  def prompt_for_two_factor(user)
    session[:otp_user_id] = user.id
    render :two_factor
  end
end
