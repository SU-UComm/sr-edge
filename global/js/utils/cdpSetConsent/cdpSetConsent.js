/**
 * CDP Set Consent
 *
 * @param {number} consented The component title
 * @returns {object}
 */
export async function cdpSetConsent(consented) {
  const call = await fetch(`/__dxp/cdp/setConsent`, {
    method: `POST`,
    headers: {
      [`Content-Type`]: `application/json`,
    },
    body: JSON.stringify({
      CDPConsent: consented,
      documentVersion: "1.0",
    }),
    redirect: `follow`,
  }).catch((error) => {
    throw new Error(error);
  });

  const resp = await call.text();
  return resp;
}

export default cdpSetConsent;
