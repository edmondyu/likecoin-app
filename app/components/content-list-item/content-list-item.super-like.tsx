import * as React from "react"
import {
  ActivityIndicator,
  TouchableHighlight,
  View,
  ViewStyle,
} from "react-native"
import { observer } from "mobx-react"

import { color } from "../../theme"

import { Button } from "../button"
import { Icon } from "../icon"
import { I18n } from "../i18n"
import { Text } from "../text"

import { SuperLikeContentListItemProps as Props } from "./content-list-item.props"
import { SuperLikeContentListItemStyle as Style } from "./content-list-item.super-like.style"
import { ContentListItemStyle as StyleCommon } from "./content-list-item.style"
import { ContentListItemSkeleton } from "./content-list-item.skeleton"
import { ContentListItemUndoView } from "./content-list-item-undo-view"
import { withContentListItemHelper } from "./content-list-item.with-helper"

@observer
class SuperLikeContentListItemBase extends React.Component<Props, {}> {
  componentDidMount() {
    this.props.fetchContentDetails(this.props.item?.content)
    this.props.fetchCreatorDetails(this.props.item?.liker)
  }

  private onToggleBookmark = () => {
    if (this.props.onToggleBookmark && this.props.item?.content) {
      this.props.onToggleBookmark(this.props.item.content)
    }
  }

  private onToggleFollow = () => {
    if (this.props.onToggleFollow && this.props.item?.liker) {
      this.props.onToggleFollow(this.props.item.liker)
    }
  }

  private onPress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.item)
    }
  }

  private onPressUndoButton = () => {
    if (this.props.onPressUndoUnfollowButton && this.props.item?.liker) {
      this.props.onPressUndoUnfollowButton(this.props.item.liker)
    }
  }

  private renderContent() {
    const { item: content } = this.props

    return (
      <TouchableHighlight
        underlayColor={this.props.underlayColor || color.palette.greyf2}
        style={Style.Root}
        onPress={this.onPress}
      >
        <View style={StyleCommon.Inset}>
          <View style={Style.HeaderView}>
            <I18n
              tx="readerScreen.SuperLikeFromLabel"
              txOptions={{ count: content?.otherLikersCount || 0 }}
              style={Style.ShareByLabel}
            >
              <Text
                text={content?.liker?.normalizedName || ""}
                place="liker"
                style={Style.LikerDisplayName}
              />
            </I18n>
            {this.props.renderMoreButton()}
          </View>
          <Text
            text={content?.content?.normalizedTitle || ""}
            style={Style.Title}
          />
          <View style={StyleCommon.FooterView}>
            <Text
              text={content?.content?.creatorDisplayName || ""}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={StyleCommon.CreatorDisplayName}
            />
            <View style={StyleCommon.AccessoryView}>
              {!!content?.content?.hasRead() && (
                <Icon
                  name="checkmark"
                  color="green"
                  width={16}
                  height={16}
                  style={Style.ReadIcon}
                />
              )}
              {this.props.isShowFollowToggle &&
                this.renderFollowToggle(!!content?.liker?.isFollowing)}
              {this.renderBookmarkButton(
                !!content?.content?.isBookmarked,
                !!content?.content?.isUpdatingBookmark,
              )}
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  private renderFollowToggle(isFollowing: boolean) {
    const buttonPreset = isFollowing ? "primary" : "secondary"
    const tx = `common.${isFollowing ? "Following" : "follow"}`
    return (
      <Button
        preset={buttonPreset}
        size="tiny"
        tx={tx}
        style={StyleCommon.AccessoryButton}
        onPress={this.onToggleFollow}
      />
    )
  }

  private renderBookmarkButton(isBookmarked: boolean, isUpdating: boolean) {
    const iconName = isBookmarked ? "bookmark-filled" : "bookmark-outlined"
    const buttonPreset = isBookmarked ? "primary" : "secondary"
    if (isUpdating) {
      return (
        <Button
          preset="plain"
          size="tiny"
          disabled={true}
          style={StyleCommon.AccessoryButton}
        >
          <ActivityIndicator size="small" />
        </Button>
      )
    }
    return (
      <Button
        preset={buttonPreset}
        size="tiny"
        icon={iconName}
        style={StyleCommon.AccessoryButton}
        onPress={this.onToggleBookmark}
      />
    )
  }

  private renderUndo() {
    return (
      <ContentListItemUndoView
        tx="common.unfollowSuccess"
        txOptions={{
          creator: this.props.item?.liker?.normalizedName || "",
        }}
        append={
          <Icon
            name="seen"
            width={24}
            height={24}
            fill={color.palette.grey9b}
          />
        }
        onPress={this.onPressUndoButton}
      />
    )
  }

  private renderSubView() {
    const { isLoading } = this.props.item?.content || {}
    const {
      isFetchingDetails: isFetchingSuperLikerDetails,
      hasFetchedDetails: hasFetchedSuperLikerDetails,
      isShowUndoUnfollow,
    } = this.props.item?.liker || {}
    if (isLoading || !this.props.item?.liker) {
      return (
        <ContentListItemSkeleton
          primaryColor={this.props.skeletonPrimaryColor}
          secondaryColor={this.props.skeletonSecondaryColor}
        />
      )
    } else if (
      this.props.onPressUndoUnfollowButton &&
      !isFetchingSuperLikerDetails &&
      hasFetchedSuperLikerDetails &&
      isShowUndoUnfollow
    ) {
      return this.renderUndo()
    }

    return this.renderContent()
  }

  render() {
    const style: ViewStyle = {
      backgroundColor: this.props.backgroundColor || color.palette.white,
      ...this.props.style,
    }
    return <View style={style}>{this.renderSubView()}</View>
  }
}

export const SuperLikeContentListItem = withContentListItemHelper(
  SuperLikeContentListItemBase,
)
