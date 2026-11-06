export default function SearchBar() {
  return (
    // {/* action direct url pr jayega - means /search vale page pr jayega kuch bhi search krne pr*/}
    <form action="/search" method="get"> 

      {/* ye automatically url pr chle jayega name= value*/}
      <input
        name="q"
        type="search"
        placeholder="Search Products..."
        className="border rounded px-3 py-1"
      />
      <button
        type="submit"
        className="px-3 py-1 bg-amber-200 text-black rounded"
      >
        Search
      </button>
    </form>
  );
}
