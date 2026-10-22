// Decorative, code-owned device compositions using existing Vectramind assets.
// These previews are deliberately separate from the later live dashboard demo.
export function PlatformPreview({
  platform,
}: {
  platform: "synapse" | "firstpass";
}) {
  if (platform === "synapse")
    return (
      <div
        className="platform-thumbnail platform-thumbnail-synapse"
        aria-hidden="true"
      >
        <img
          className="platform-thumbnail-brand"
          src="/images/synapse.svg"
          alt=""
          width="115"
          height="35"
          loading="lazy"
        />
        <div className="platform-preview-laptop">
          <div className="platform-preview-screen">
            <div className="platform-dashboard-crop">
              <img
                src="/images/synapse-screen.webp"
                alt=""
                width="1438"
                height="506"
                loading="lazy"
              />
            </div>
          </div>
          <div className="platform-preview-keyboard">
            <span />
          </div>
        </div>
        <span className="platform-preview-orbit" />
      </div>
    );
  return (
    <div
      className="platform-thumbnail platform-thumbnail-firstpass"
      aria-hidden="true"
    >
      <div className="platform-preview-phone">
        <span className="platform-phone-camera" />
        <div className="platform-phone-page">
          <img
            src="/images/firstpass.svg"
            className="platform-phone-brand"
            alt=""
            width="95"
            height="25"
            loading="lazy"
          />
          <h4>
            Your care.
            <br />
            Connected.
          </h4>
          <p>
            A simpler journey,
            <br />
            every step of the way.
          </p>
          <img
            className="platform-phone-photo"
            src="/images/firstpass-reception.webp"
            alt=""
            width="1122"
            height="1402"
            loading="lazy"
          />
          <div className="platform-phone-appointment">
            <span>Your next visit</span>
            <strong>Appointment confirmed</strong>
            <small>Today · 10:30 AM</small>
            <i>
              Check in <span>↗</span>
            </i>
          </div>
        </div>
      </div>
    </div>
  );
}
