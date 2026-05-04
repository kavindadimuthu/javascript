/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {AsgardeoError, User, withVendorCSSClassPrefix} from '@asgardeo/browser';
import {type Component, type PropType, type SetupContext, type VNode, defineComponent, h, ref, type Ref} from 'vue';
import BaseUserProfile from './BaseUserProfile';
import updateMeProfile from '../../../api/updateMeProfile';
import useAsgardeo from '../../../composables/useAsgardeo';
import useI18n from '../../../composables/useI18n';
import useUser from '../../../composables/useUser';

type UserProfileProps = Readonly<{
  cardLayout: boolean;
  className: string;
  editable: boolean;
  hideFields: string[];
  showFields: string[];
  title: string;
}>;

const UserProfile: Component = defineComponent({
  name: 'UserProfile',
  props: {
    cardLayout: {default: true, type: Boolean},
    className: {default: '', type: String},
    editable: {default: true, type: Boolean},
    hideFields: {default: () => [], type: Array as PropType<string[]>},
    showFields: {default: () => [], type: Array as PropType<string[]>},
    title: {default: 'Profile', type: String},
  },
  setup(props: UserProfileProps, {slots}: SetupContext): () => VNode {
    const {baseUrl, instanceId} = useAsgardeo();
    const {flattenedProfile, profile, schemas, onUpdateProfile} = useUser();
    const {t} = useI18n();

    const error: Ref<string | null> = ref<string | null>(null);

    async function handleProfileUpdate(payload: any): Promise<void> {
      if (!baseUrl) return;

      error.value = null;

      try {
        const response: User = await updateMeProfile({baseUrl, instanceId, payload});
        onUpdateProfile(response);
      } catch (caughtError: unknown) {
        let message: string = t('user.profile.update.generic.error') || 'Failed to update profile. Please try again.';

        if (caughtError instanceof AsgardeoError) {
          message = caughtError.message;
        }

        error.value = message;
      }
    }

    return (): VNode =>
      h(
        BaseUserProfile,
        {
          cardLayout: props.cardLayout,
          class: withVendorCSSClassPrefix('user-profile--styled'),
          className: props.className,
          editable: props.editable,
          error: error.value,
          flattenedProfile: flattenedProfile?.value,
          hideFields: props.hideFields,
          onUpdate: handleProfileUpdate,
          profile: profile?.value?.profile ?? flattenedProfile?.value,
          schemas: schemas?.value,
          showFields: props.showFields,
          title: props.title,
        },
        slots,
      );
  },
});

export default UserProfile;
