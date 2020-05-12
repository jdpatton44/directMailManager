import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(jobs) {
        console.log(jobs);
        return jobs
                .map(
                        job => `
            <a href="/job/${job.jobSlug}" class="search__result">
                <strong>${job.jobName}</strong>
            </a>
        `
                )
                .join('');
}

function typeAhead(search) {
        if (!search) return;

        const searchInput = search.querySelector('input[name="search"]');
        const searchResults = search.querySelector('.search__results');

        // on is add event listener in bling.js
        searchInput.on('input', function() {
                // if there is no value quit!
                if (!this.value) {
                        searchResults.style.display = 'none';
                        return;
                }

                // show search results
                searchResults.style.display = 'block';
                searchResults.innerHTML = '';
                axios.get(`/api/search?q=${this.value}`)
                        .then(res => {
                                if (res.data.length) {
                                        console.log('there is some data!');
                                        searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
                                        return;
                                }
                                // tell them nothing came back
                                searchResults.innerHTML = dompurify.sanitize(
                                        `<div class="search__result">No results for ${this.value} found~ </div>`
                                );
                        })
                        .catch(err => {
                                console.log(err);
                        });
        });

        // handle keyboard inputs only up down enter 38,40,13

        searchInput.on('keyup', e => {
                if (![38, 40, 13].includes(e.keyCode)) {
                        return;
                }
                const activeClass = 'search__result--active';
                const current = search.querySelector(`.${activeClass}`);
                const items = search.querySelectorAll('.search__result');
                let next;
                if (e.keyCode === 40 && current) {
                        next = current.nextElementSibling || items[0];
                } else if (e.keyCode === 40) {
                        next = items[0];
                } else if (e.keyCode === 38 && current) {
                        next = current.previousElementSibling || items[items.length - 1];
                } else if (e.keyCode === 38) {
                        next = items[items.length - 1];
                } else if (e.keyCode === 13 && current.href) {
                        window.location = current.href;
                }
                if (current) {
                        current.classList.remove(activeClass);
                }
                next.classList.add(activeClass);
        });
}

export default typeAhead;
