import style from "./gif.module.css";

const Gif = ({ img }) => (
  <div className={style.gif}>
    <img className={style.image} src={img} alt="tenorgif" />
  </div>
);

export default Gif;
