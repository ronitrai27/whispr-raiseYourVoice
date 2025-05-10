### COMMENTS --------------- FEATURES

Feature | UX Rating | Notes
Infinite Scroll | ✅✅✅ | Natural, seamless
Shuffle on Refresh | ✅✅✅ | Genius for freshness
Trending Filters | ✅✅✅ | Topic-driven = engagement engine
Websockets for Likes/Replies | ✅✅✅ | Feels modern & responsive
Time Ago Formatting | ✅✅✅ | Helps with post relevance
Manual Refresh + Banner | ✅✅✅ | Gives control & engagement

<!-- -------------------- -->

reset the state after profile setup
keep the username in lowercase
make more random public id

<!-- -------------------------------------- -->

A controller (probably something like /api/users/:username) that serves user profile data.
2️⃣ That controller uses Redis to cache the user data (so repeated requests are fast).
3️⃣ Separately, your socketHandler listens to follow / unfollow events, updates the MongoDB database — but was NOT updating the Redis cache.

This mismatch causes:

After a follow/unfollow, the database is updated,

But when you refresh the page, your frontend calls the controller → which serves stale data from Redis → so UI shows old values.
