class ItemResolvers {
  static returnAllItems(obj: any, args: any) {
    console.log(obj, args);
    return [
      {
        item_uuid: 1,
        item_name: "test",
        item_price: 9,
        create_dttm: null,
        user_id: 2,
        cat_id: 32,
      },
      {
        item_uuid: 2,
        item_name: "test_two",
        item_price: 90,
        create_dttm: null,
        user_id: 22,
        cat_id: 321,
      },
    ];
  }
}

export default ItemResolvers;
