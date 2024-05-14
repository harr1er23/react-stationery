import React from "react";
import { useSelector } from "react-redux";

import styles from "./Home.module.scss";

import smile from "../../assets/ico/favorite-smile.png";

import Product from "../../components/Product/index";
import Parameters from "../../components/Parameters/index";
import Error from "../../components/Error/index";
import Pagination from "../../components/Pagination/index";
import ItemSkeleton from "../../components/Skeletons/ItemSkeleton";
import ClearPage from "../../components/ClearPage";

import {
  selectPaginationId,
  setPaginationId,
  setPaginationNull,
} from "../../store/pagination/paginationSlice";
import {
  selectParametersId,
  setParametersId,
} from "../../store/filter/filterSlice";
import { selectSearch, setSearchValue } from "../../store/search/searchSlice";
import { fetchItems } from "../../store/products/itemsSlice";
import { fetchCart } from "../../store/cart/cartSlice";
import {
  fetchFavorite,
  selectFavorite,
} from "../../store/favorite/favoriteSlice";
import { selectCart } from "../../store/cart/cartSlice";
import { selectItems } from "../../store/products/itemsSlice";
import { useAppDispatch } from "../../store/store";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { parameterId } = useSelector(selectParametersId);
  const { paginationId } = useSelector(selectPaginationId);
  const { value } = useSelector(selectSearch);
  const { items, status, paginationCount } = useSelector(selectItems);
  const { favoriteItems, favoriteStatus } = useSelector(selectFavorite);
  const { cartItems, cartStatus } = useSelector(selectCart);
  const [inputValue, setInputValue] = React.useState("");


  const changeParameter = (id: number) => {
    dispatch(setParametersId(id));
    dispatch(setPaginationNull());
  };

  const changePagination = (id: number) => {
    dispatch(setPaginationId(id));
  };

  const changeSearchValue = (value: string) => {
    dispatch(setSearchValue(value));
  };

  const parameter = parameterId > 0 ? `type=${parameterId}` : "";
  const search = value ? `name=*${value}*` : "";
  const paginationValue = `page=${paginationId}&limit=8`;

  //получение товаров
  React.useEffect(() => {
    dispatch(fetchItems({ parameter, search, paginationValue }));
    setInputValue(value);
  }, [parameter, search, paginationValue]);

  React.useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchFavorite());
  }, [])

  return (
    <>
      <Parameters
        changeParameter={changeParameter}
        changeSearchValue={changeSearchValue}
        setSearchValue={setInputValue}
        searchValue={inputValue}
      />
      <h3>Все товары</h3>
      <div className={styles.productList}>
        {items.length === 0 && status === "success" && (
          <ClearPage
            header={"Пусто..."}
            text={"Похоже товаров, удовлетворяющих вашему запросу, нет"}
            smile={smile}
          />
        )}
        {status === "loading" &&
        cartStatus === "loading" &&
        favoriteStatus === "loading"
          ? [...new Array(8)].map((_, index) => <ItemSkeleton key={index} />)
          : status === "success" &&
            cartStatus === "success" &&
            favoriteStatus === "success" &&
            items.map((obj) => (
              <Product
                isAddToFavorite={favoriteItems.some(
                  (product) => obj.id === product.id
                )}
                isAddToCart={cartItems.some((product) => obj.id === product.id)}
                key={obj.id}
                favorite={favoriteItems}
                {...obj}
              />
            ))}
        {status === "error" ||
        favoriteStatus === "error" ||
        cartStatus === "error" ? (
          <Error
            header={"#404 Упс!"}
            text={"Не удалось соединиться с сервером. Попробуйте позже"}
          />
        ) : null}
      </div>
      {paginationCount > 1 && status !== "error" && favoriteStatus !== "error" && cartStatus !== "error" ? (
        <Pagination
          length={paginationCount}
          changePagination={changePagination}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Home;
