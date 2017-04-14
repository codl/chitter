# frozen_string_literal: true

module Admin::AccountsHelper
  def filter_params(more_params)
    params.permit(:local, :remote, :by_domain, :silenced, :suspended, :recent).merge(more_params)
  end

  def filter_link_to(text, more_params)
    new_url = filtered_url_for(more_params)
    link_to text, new_url, class: filter_link_class(new_url)
  end

  def table_link_to(icon, text, path, options = {})
    link_to safe_join([fa_icon(icon), text]), path, options.merge(class: 'table-action-link')
  end

  private

  def filter_link_class(new_url)
    filtered_url_for(params) == new_url ? 'selected' : ''
  end

  def filtered_url_for(params)
    url_for filter_params(params)
  end
end
