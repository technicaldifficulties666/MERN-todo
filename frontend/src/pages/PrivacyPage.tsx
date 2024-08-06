import styleUtils from "../styles/utils.module.css";

const PrivacyPage = () => {
  return (
    <div>
      <h5
        style={{marginTop: "2rem"}}
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
      >
        We care about your privacy
      </h5>
    </div>
  );
};

export default PrivacyPage;
