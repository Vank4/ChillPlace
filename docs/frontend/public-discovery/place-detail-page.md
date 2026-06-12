# Place Detail Page `/places/:placeId`

## Trang Vua Hoan Thanh

Da nang cap trang **Place Detail Page** tu giao dien chi tiet co ban sang trang chi tiet dia diem hoat dong duoc bang mock API, state va localStorage.

Trang nay duoc mo tu:

- Explore/Search: nut `Chi tiet` tren card dia diem.
- Map: nut `Chi tiet` trong preview panel.
- Related places: danh sach goi y trong chinh trang chi tiet.

## File Duoc Them/Sua/Xoa

- `apps/web/src/features/places/pages/PlaceDetailPage.jsx`
  - Xoa component cu va viet lai component chi tiet moi.
  - Doc `placeId` tu URL bang `useParams`.
  - Goi `getPlaceById(placeId)` de lay thong tin dia diem.
  - Goi `getPlaces(...)` de lay danh sach dia diem lien quan cung category.
  - Dung `getSavedPlaceIds()` va `toggleSavedPlace(...)` de luu/bo luu dia diem bang localStorage.
  - Nut `Chi duong` dieu huong sang `/map?place=:id`.
  - Nut related place dieu huong sang `/places/:id`.

- `apps/web/src/features/places/pages/PlaceDetailPage.css`
  - Xoa CSS cu va viet lai layout moi.
  - Them hero anh lon co overlay trang thai/rating.
  - Them summary card, facts, amenities, reviews, mini map va related places.
  - Responsive:
    - Mobile: mot cot, hero 4:3, toolbar sticky gon, actions xep doc khi hep.
    - Desktop: main content + aside sticky ben phai.

## Chi Tiet Code Da Trien Khai

- Trang co cac state chinh:
  - `place`: dia diem dang xem.
  - `relatedPlaces`: dia diem goi y cung category.
  - `isLoading`: trang thai dang tai mock API.
  - `savedPlaceIds`: danh sach id dia diem da luu trong localStorage.

- Cac khoi UI chinh:
  - Toolbar quay lai, chia se, luu dia diem.
  - Hero media hien anh dia diem, trang thai va rating.
  - Summary card hien category, ten, vi tri, mo ta, tag, thong tin nhanh.
  - Action buttons: `Chi duong`, `Luu dia diem`.
  - Tien ich noi bat: wifi, goc chup dep, khong gian chill, o cam/uu dai tuy du lieu.
  - Review gan day: review demo dung mock content.
  - Mini map card: nut mo `/map?place=:id`.
  - Related places: danh sach dia diem lien quan co the bam de qua trang chi tiet khac.

## Route Lien Quan

- `/places/:placeId`
  - Khai bao trong `apps/web/src/app/App.jsx`.
  - Component render: `PlaceDetailPage`.

- `/map?place=:id`
  - Duoc dung khi bam `Chi duong` hoac `Mo ban do`.

## Du Lieu Mock Dang Dung

- `apps/web/src/services/place.service.js`
  - `getPlaceById(placeId)`
  - `getPlaces(params)`
  - `getSavedPlaceIds()`
  - `toggleSavedPlace(placeId)`

- `apps/web/src/mocks/places.mock.js`
  - Chua danh sach dia diem, anh, rating, review count, price range, status, tags, description.

## Kiem Thu

Da chay:

```bash
cd apps/web
npm run build
```

Ket qua:

```text
built in 2.14s
```

## Cap Nhat Polish Layout Va Scroll Animation

Da tiep tuc nang cap trang chi tiet theo huong gon, phang va chuyen nghiep hon.

- `apps/web/src/features/places/pages/PlaceDetailPage.jsx`
  - Viet lai noi dung hien thi bang tieng Viet co dau de tranh loi ky tu tren UI.
  - Giu nguyen logic:
    - Lay place theo `placeId`.
    - Lay related places cung category.
    - Luu/bo luu bang localStorage.
    - Dieu huong sang `/map?place=:id`.

- `apps/web/src/features/places/pages/PlaceDetailPage.css`
  - Giam scale tong the:
    - `max-width` tu 1040px xuong 980px.
    - Giam padding/gap.
    - Giam hero height, mini-map height, heading size, button height.
  - Bo bot card bo tron:
    - Section chinh dung border top/bottom mong thay cho cac khung card day.
    - Nen section chuyen ve transparent.
    - Mini-map va hero chi con radius nhe.
  - Them animation khi nguoi dung luot xuong:
    - `detailFadeUp` cho hero.
    - `detailReveal` cho summary, section, mini-map, related places.
    - Dung `animation-timeline: view()` va `animation-range`.
    - Co fallback `@supports not (animation-timeline: view())`.
    - Co `prefers-reduced-motion: reduce` de tat animation khi nguoi dung can giam chuyen dong.
  - Them polish nho:
    - Review hover truot nhe.
    - Related place hover truot nhe.
    - Button hover nang nhe.

Build kiem tra moi nhat:

```text
built in 2.49s
```

## Giai Thich Cho Giang Vien

Neu hoi trang chi tiet nam o dau:

- `apps/web/src/features/places/pages/PlaceDetailPage.jsx`
- `apps/web/src/features/places/pages/PlaceDetailPage.css`

Neu hoi nut luu dia diem hoat dong nhu the nao:

- Trong `PlaceDetailPage.jsx`, nut save goi `toggleSavedPlace(place.id)`.
- Service luu danh sach id vao localStorage key `chillplace.savedPlaces`.

Neu hoi nut chi duong hoat dong nhu the nao:

- Nut `Chi duong` goi `navigate(`/map?place=${place.id}`)`.
- Trang Map doc query `place` de mo dung preview dia diem.

Neu hoi related places lay tu dau:

- Sau khi lay duoc `place`, trang goi `getPlaces({ category: place.categoryId, nearby: true })`.
- Sau do loc bo dia diem hien tai va lay toi da 3 dia diem lien quan.

## Cap Nhat Detail Action, Thong Tin Day Du Va User Review

Da tiep tuc fix trang chi tiet theo yeu cau moi:

- `apps/web/src/features/places/pages/PlaceDetailPage.jsx`
  - Khoi phuc va nang cap lai component `PlaceDetailPage`.
  - Chuyen nut share, nut luu va rating vao cung cum action tren hero image.
  - Rating dung `place-detail__rating-pill`, khong con nen cam dac; icon sao noi bat bang mau vang.
  - Them localStorage key `chillplace.userReviews` de mock danh gia cua nguoi dung.
  - Neu nguoi dung chua danh gia:
    - Hien form chon 1-5 sao.
    - Hien textarea de nhap cam nhan.
    - Bam `Luu danh gia` thi luu vao localStorage.
  - Neu nguoi dung da danh gia:
    - Hien block `Danh gia cua anh`.
    - Co nut `Cap nhat danh gia` de sua lai noi dung.

- `apps/web/src/features/places/pages/PlaceDetailPage.css`
  - Tang width tong trang len `1180px` de giam cam giac bi boc trong khung trong lon.
  - Giam padding khung ngoai de trang lien mach hon voi nen chung.
  - Cho thong tin detail xuong dong tu nhien:
    - Dia chi khong bi cat bang dau `...`.
    - Facts nhu gia, danh gia, trang thai khong dung `text-overflow`.
  - Nut `Chi duong` va `Mo ban do` doi sang style trong suot, nhe hon va hop voi bo cuc detail.
  - Them style cho user review composer:
    - Rating sao co hover/active animation.
    - Textarea focus co ring nhe.
    - Nut luu/cap nhat danh gia co hover animation.

Build kiem tra moi nhat:

```text
npm run build
✓ built in 2.19s
```
