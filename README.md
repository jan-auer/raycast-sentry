# Raycast Extension for Sentry

Work with Sentry errors, performance monitoring, and releases directly out of
Raycast.

## Setup

You can use a User Auth Token to authenticate your Sentry account:

 1. Go to <https://sentry.sentry.io/settings/account/api/auth-tokens/>
 2. Click "Create New Token"
 3. Leave the default read-only scopes:
    - `project:read`
    - `team:read`
    - `event:read`
    - `member:read`
    - `org:read`
 4. If you wish to resolve and archive issues from the extension, also select:
    - `event:admin`
 5. Click "Create Token"
 6. Copy the token and provide it to the Sentry extension when asked
