import './index.css'

const FiltersGroup = props => {
  const renderCategories = () => {
    const {categoryOptions} = props
    return categoryOptions.map(category => {
      const {changeCategory} = props
      const onClickCategoryItem = () => changeCategory(category.categoryId)
      return (
        <li
          className="categories"
          key={category.categoryId}
          onClick={onClickCategoryItem}
        >
          <p>{category.name}</p>
        </li>
      )
    })
  }

  const renderRatings = () => {
    const {ratingsList} = props
    return ratingsList.map(rating => {
      const {changeRating} = props
      const onClickRatingItem = () => changeRating(rating.ratingId)
      return (
        <li
          className="ratings"
          key={rating.ratingId}
          onClick={onClickRatingItem}
        >
          <img
            src={rating.imageUrl}
            alt={`rating ${rating.ratingId}`}
            className="stars-custom"
          />
          <p>& up</p>
        </li>
      )
    })
  }

  const onEnterSearchInput = event => {
    const {enterSearchInput} = props
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  const onChangeSearchInput = event => {
    const {searchProduct} = props
    searchProduct(event.target.value)
  }

  const renderInputSearch = () => (
    <div className="search-input">
      <input
        type="search"
        placeholder="Search"
        onChange={onChangeSearchInput}
        onKeyDown={onEnterSearchInput}
      />
    </div>
  )

  const renderCategoriesProducts = () => (
    <>
      <h1>Category</h1>
      <ul>{renderCategories()}</ul>
    </>
  )

  const renderRatingList = () => (
    <>
      <h1>Rating</h1>
      <ul>{renderRatings()}</ul>
    </>
  )

  const onClickClearFilter = () => {
    const {onClearFilters} = props
    onClearFilters()
  }

  const renderClearFilterButton = () => (
    <button
      className="clear-filter-button"
      type="button"
      onClick={onClickClearFilter}
    >
      Clear Filters
    </button>
  )
  return (
    <div className="filters-group-container">
      {renderInputSearch()}
      {renderCategoriesProducts()}
      {renderRatingList()}
      {renderClearFilterButton()}
    </div>
  )
}

export default FiltersGroup
