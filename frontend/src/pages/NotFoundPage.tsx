import styleUtils from "../styles/utils.module.css";

const NotFoundPage = () => {
  return (
    <div>
      <h3
        style={{marginTop: "2rem"}}
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
      >
        Oops... Page not found!
      </h3>
    </div>
  );
};

export default NotFoundPage;
