import styles from "./Profile.module.scss";

import ClearPage from '../../components/ClearPage';

import smile from "../../assets/ico/profile-smile.png";

const Profile = () => {
  return (<div className={styles.profile}>
    <ClearPage
    header={"У вас нет заказов"}
    text={"Вероятней всего, вы ещё не совершали покупок."}
    smile={smile}
    />
    </div>
  )
}

export default Profile;