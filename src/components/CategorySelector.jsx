import { CONTENT_TYPES } from '../constants/contentTypes'

// 카테고리 버튼들 (관광지, 문화시설, 음식점 등)
function CategorySelector({ selectedContentTypeId, onChange }) {
  // CONTENT_TYPES의 키만 숫자로 가져와서 [12, 14, 15, ...] 처럼 만듦
  const contentTypeIds = Object.keys(CONTENT_TYPES).map(Number)

  return (
    <div className="category-selector">
      <div className="category-selector__label">카테고리 선택</div>
      <div className="category-selector__buttons">
        {contentTypeIds.map((contentTypeId) => {
          const isActive = selectedContentTypeId === contentTypeId
          const buttonClass = isActive
            ? 'category-selector__button category-selector__button--active'
            : 'category-selector__button'
          return (
            <button
              key={contentTypeId}
              type="button"
              className={buttonClass}
              onClick={() => onChange(contentTypeId)}
            >
              {CONTENT_TYPES[contentTypeId]}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CategorySelector
