const CountySearch = () => {
  return (
    <input
      className="w-96 rounded-3xl"
      name="county"
      type="text"
      disabled={true}
      placeholder="Search for County or State"
    />
  );
};

export default CountySearch;
