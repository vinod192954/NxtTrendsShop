import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const statusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  successful: 'SUCCESSFULL',
}
class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryId: '',
    activeRatingId: '',
    searchInput: '',
    apiStatus: statusConstants[0],
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
      apiStatus: statusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const {
      activeOptionId,
      activeRatingId,
      activeCategoryId,
      searchInput,
    } = this.state

    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
        apiStatus: statusConstants.successful,
      })
    } else {
      this.setState({apiStatus: statusConstants.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  productListView = () => {
    const {productsList, activeOptionId} = this.state
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    const showproductsList = productsList.length > 0
    return showproductsList
      ? this.productListView()
      : this.renderEmptyProductsView()
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  changeCategory = activeCategoryId => {
    this.setState({activeCategoryId}, this.getProducts)
  }

  changeRating = activeRatingId => {
    this.setState({activeRatingId}, this.getProducts)
  }

  searchProduct = searchValue => {
    this.setState({searchInput: searchValue})
  }

  enterSearchInput = () => {
    this.getProducts()
  }

  renderEmptyProductsView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
        className="no-products-img"
      />
      <h1>No Products Found</h1>
      <p>We could not find any products.Try other filters</p>
    </div>
  )

  onClearFilters = () => {
    const {activeOptionId, activeCategoryId, activeRatingId} = this.state
    this.setState(
      {
        searchInput: '',
        activeCategoryId: '',
        activeOptionId: sortbyOptions[0].optionId,
        activeRatingId: '',
      },
      () => {
        this.getProducts()
      },
    )
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png "
        alt="products failure"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>
        We are having some trouble processing your request.Please try again.
      </p>
    </div>
  )

  renderResultView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case statusConstants.inProgress:
        return this.renderLoader()
      case statusConstants.successful:
        return this.renderProductsList()
      case statusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {isLoading} = this.state

    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryOptions={categoryOptions}
          searchProduct={this.searchProduct}
          enterSearchInput={this.enterSearchInput}
          onClearFilters={this.onClearFilters}
          ratingsList={ratingsList}
          changeCategory={this.changeCategory}
          changeRating={this.changeRating}
        />

        {this.renderResultView()}
      </div>
    )
  }
}

export default AllProductsSection
