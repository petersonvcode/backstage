/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import { ProxiedSignInPage } from '@backstage/core-components';
// import { microsoftAuthApiRef } from '@backstage/core-plugin-api';

const signInPage = SignInPageBlueprint.make({
  params: {
    loader: async () => props => {
      // const random = Math.random();
      // if (random < 0.5)
      //   return (
      //     <SignInPage
      //       {...props}
      //       providers={[
      //         'guest',
      //         {
      //           id: 'microsoft-auth-provider',
      //           title: 'Microsoft',
      //           message: 'Sign In using Microsoft Azure AD',
      //           apiRef: microsoftAuthApiRef,
      //         },
      //       ]}
      //       title="Select a sign-in method"
      //       align="center"
      //     />
      //   );

      return (
        <ProxiedSignInPage
          {...props}
          provider="awsalb"
          headers={{ 'X-Requested-With': 'XMLHttpRequest' }}
        />
      );
    },
  },
});

/**
 * The default new-frontend sign-in page only enables `guest`. OAuth providers
 * must be listed here so buttons appear; they still require matching
 * `auth.providers` in app-config and the auth backend module.
 *
 * @see https://backstage.io/docs/auth/#sign-in-configuration
 */
export const appModuleSignInPage = createFrontendModule({
  pluginId: 'app',
  extensions: [signInPage],
});
