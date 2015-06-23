# `Session` Class API

A session represents a flow of CPIM messages between two peers, the local one and the remote one.

A CPIM peer may be an intermediary box sending/forwarding messages in behalf of other peers, so a session is not tied to specific and fixed identities. In other words: a session represents a channel from which remote CPIM messages are received and where locally generated CPIM messages are sent to the remote recipient.
