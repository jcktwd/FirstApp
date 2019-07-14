<template lang="pug">
	div(class="container mt-3")
		div(class="card text-center text-light bg-dark")
			div(h1 class="card-header") About
			div(class="card-body")
				h3(class="card-title text-info") What
				p(class="card-text") First is a social revision website. People subscribe to courses and submit their revision content to it. Other people can see your content for the course and help eachother out!
				h5(class="text-info") Content Types
				ul(class="list-inline")
					li(class="list-inline-item") Flashcards
					li(class="list-inline-item") Notepages
					li(class="list-inline-item") Simple Notes
					li(class="list-inline-item") Announcements
				h3(class="card-title text-info") Why
				p(class="card-text") This web app was created for the Durham University Programming Paradigms Module's Web Programming Assignment for the 18/19 academic year.
				h3(class="card-title text-info") How
				p(class="card-text") The site uses  HTML, CSS and JavaScript making use of Bootstrap and the Vue framework to create a responsive single page web app.  The site server is written in node.js and uses express for routing. It also uses jQuery. The content also support markdown formatting so you can include images..
</template>
