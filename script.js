function createReviewItem(review) {	// Создание HTML-элемента новости
    return `
        <div id="review-${review.id}" class="review-item">
            <h3>${review.name}</h3>
            <p>${review.body}</p>
        </div>
    `;
}

function getReviews() {		// Получение новостей
    fetch('https://jsonplaceholder.typicode.com/comments?_limit=4')
        .then(response => response.json())
        .then(reviews => {
            fillReviewsList(reviews);
			
            reviews.forEach(review => {		 // Обработчик событий к каждому отзыву (нажатие на отзыв) 
                const reviewElement = document.getElementById(`review-${review.id}`);
                reviewElement.style.cursor = 'pointer';
                reviewElement.addEventListener('click', () => {
                    getFullReview(review.id);
                });
            });
        })
}

function getFullReview(reviewId) {		// Получения полной информации о новости
    fetch(`https://jsonplaceholder.typicode.com/comments/${reviewId}`)
        .then(response => response.json())
        .then(fullReview => {
            showFullReview(fullReview);
        })
}

function fillReviewsList(reviews) {		// Заполнения списка новостей на странице
    const reviewsListContainer = document.getElementById('reviewsList');
    if (reviews.length > 0) {
        reviewsListContainer.innerHTML = reviews.map(review => createReviewItem(review)).join('');
    } else {
        reviewsListContainer.innerHTML = '<p>Новостей пока нет.</p>';
    }
}

function showFullReview(fullReview) {		// Функция для отображения полной информации о новости
    alert(`Новость:\n\n${JSON.stringify(fullReview, null, 2)}`);
}

function applyFilter() {	// Применения фильтрации
    const filterInput = document.getElementById('filterInput');
    const filterValue = filterInput.value.trim().toLowerCase();
    if (filterValue) {	 // Проверка наличия значений в полях
        filterReviews(filterValue);
    } else {	        // Если поле пустое, отображаются все новости
        getReviews();
    }
}

function filterReviews(filterValue) {	// Фильтрация новостей
    fetch('https://jsonplaceholder.typicode.com/comments')
        .then(response => response.json())
        .then(reviews => {
            const filteredReviews = reviews.filter(review =>
                review.name.toLowerCase().includes(filterValue)
            );
            fillReviewsList(filteredReviews);
        })
}

function submitMaterial() {	// Функция для отправки материала из формы "Оставить заявку на сайте"
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const title = titleInput.value.trim();	// Удаление лишних пробелов с начала и конца строки 
    const description = descriptionInput.value.trim();
    if (!title || !description) {	    // Проверка наличия значений в полях
        alert('Пожалуйста, заполните все поля.');
        return;
    };
    const postData = {
        title: title,
        description: description
    };
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Ваша завка успешно отправлена!');
        titleInput.value = '';	  // Очистка полей формы после успешной отправки
        descriptionInput.value = '';
    })
};

document.addEventListener('DOMContentLoaded', function () {		// Отображение новостей при загрузке страницы
        getReviews();
    const filterButton = document.getElementById('filterButton');	// Добавляем обработчик события к кнопке фильтрации
    filterButton.addEventListener('click', applyFilter);
});

document.getElementById('showAllButton').addEventListener('click', () => {	// Нажатие на кнопку "Показать все"
    getReviews();
	filterInput.value = ''; // Очистка поля фильтра
});


