# h00t.works deployment

The public page shows mail submission (587 TCP), IMAP (993 TCP), Stalwart
readiness and Directus availability. Checks run once a minute and require two
consecutive failures before opening an incident. No alert webhook is configured.

These are observations from the scheduled Worker's location. Bunny DNS chooses
an ingress for that resolver; FlareWatch does not compute a worldwide consensus.
Latency is from the check location, not from each visitor's browser. TCP checks
only open a connection: they do not validate TLS, read greetings, authenticate,
or deliver mail. Stalwart readiness checks the backend through HTTPS. Directus
uses `/server/ping`; `/server/health` requires authentication.

## Private ingress inventory

`FLAREWATCH_PRIVATE_MONITORS` is an Actions secret containing a JSON array of
monitor definitions. It currently covers HTTPS, submission and IMAP TCP ports
on each IPv4 gateway, plus HTTPS TCP on the two IPv6 gateways. The inventory is
kept out of Git even while this fork is public.

The deploy job generates `packages/config/src/private-ingress.ts` from that
secret, forces every entry to `private: true` and `link: false`, and runs the
config validation tests before deploying either Worker. The committed module is
empty. Signed-out visitors cannot see these monitors through the page or API.
They appear after operator sign-in at `/login`.

To update the inventory, edit the ignored `.direnv/private-monitors.json`, then:

```bash
gh secret set FLAREWATCH_PRIVATE_MONITORS --repo janinge/flarewatch < .direnv/private-monitors.json
gh workflow run deploy.yml --repo janinge/flarewatch --ref main
```

Operator credentials for this installation are saved locally in the ignored
`.direnv/operator-login.txt`. The password hash is stored in the
`FLAREWATCH_ADMIN_BASIC_AUTH` Actions secret. Store the password in your password
manager. GitHub cannot return the value of an existing Actions secret.

A next step for stronger ingress monitoring is an HTTPS health route per gateway
or an independent probe that validates mail TLS and protocol greetings. Those
would detect more than the initial TCP reachability checks.
