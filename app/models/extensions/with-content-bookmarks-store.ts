import { getRoot, IStateTreeNode } from "mobx-state-tree"

import { ContentBookmarksStore } from "../content-bookmarks-store"

/**
 * Adds a `contentBookmarksStore` property to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
export const withContentBookmarksStore = (self: IStateTreeNode) => ({
  views: {
    /**
     * The content bookmarks store.
     */
    get contentBookmarksStore() {
      return getRoot(self).contentBookmarksStore as ContentBookmarksStore
    },
    /**
     * Check whether the content is bookmarked or not
     * @param url The cannonical URL of the content
     * @return boolean
     */
    checkIsBookmarkedURL(url: string) {
      const bookmark = this.contentBookmarksStore.items.get(url)
      return bookmark && !bookmark.willBeDeleted
    },
    getBookmarkByURL(url: string) {
      return this.contentBookmarksStore.items.get(url)
    },
  },
  actions: {
    updateBookmarkIsArchived(url: string, value: boolean) {
      ;(getRoot(self).contentBookmarksStore as ContentBookmarksStore).items
        .get(url)
        ?.setIsArchived(value)
    },
  },
})
