# frozen_string_literal: true

class SuspendAccountService < BaseService
  def call(account)
    @account = account

    purge_content
    purge_profile
    unsubscribe_push_subscribers
  end

  private

  def purge_content
    @account.statuses.reorder(nil).find_each do |status|
      # This federates out deletes to previous followers
      RemoveStatusService.new.call(status)
    end

    @account.media_attachments.destroy_all
    @account.stream_entries.destroy_all
    @account.notifications.destroy_all
    @account.favourites.destroy_all
    @account.active_relationships.destroy_all
    @account.passive_relationships.destroy_all
  end

  def purge_profile
    @account.suspended    = true
    @account.display_name = ''
    @account.note         = ''
    @account.avatar.destroy
    @account.header.destroy
    @account.save!
  end

  def unsubscribe_push_subscribers
    @account.subscriptions.destroy_all
  end
end
