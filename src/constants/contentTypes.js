// 카테고리 번호 → 한글 이름 (API에서 쓰는 숫자와 우리가 보여줄 이름)
export const CONTENT_TYPES = {
  12: '관광지',
  14: '문화시설',
  15: '축제/공연',
  28: '레포츠',
  32: '숙박',
  38: '쇼핑',
  39: '음식점',
}

// 처음 들어왔을 때 기본으로 선택할 카테고리 (12 = 관광지)
export const DEFAULT_CONTENT_TYPE_ID = 12

// 번호 넣으면 한글 이름 돌려줌 (없으면 '알 수 없음')
export function getContentTypeName(contentTypeId) {
  return CONTENT_TYPES[contentTypeId] ?? '알 수 없음'
}
