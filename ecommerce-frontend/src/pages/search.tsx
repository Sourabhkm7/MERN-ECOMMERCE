import { useState } from "react"

const Search = () => {

  const[search,setSearch] = useState("");
  const[sort,setSort] = useState("");
  const[maxPrice,setMaxPrice] = useState(100000);
  const[category,setCategory] = useState("");
  const[page,setPage] = useState(1);


  return (
    <div className="product-search-page" >
      <aside>
        <h2>Filters</h2>
        <div>
        <h4>Sort</h4>
          <select 
            value={sort} 
            onChange={(e) =>setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price(Low to High)</option>
            <option value="dsc">Price(High to Low)</option>
          </select>
        </div>
        <div>
          <h4>Max Price: {maxPrice || "" }</h4>
          <input 
            type="range"
            min={100}
            max={100000}
            value={maxPrice} 
            onChange={(e) =>setMaxPrice(Number(e.target.value))}
           />
        </div>

        <div>
        <h4>Category</h4>
          <select 
            value={category} 
            onChange={(e) =>setCategory(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price(Low to High)</option>
            <option value="dsc">Price(High to Low)</option>
          </select>
        </div>
      </aside>
      <main>

      </main>
      
    </div>
  )
}

export default Search
