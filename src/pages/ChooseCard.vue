<script setup>
	// This file should source the JSON (from wherever), update the local store, and move us to the next page.
</script>

<template>
	<h1>Choose a Bingo Card</h1>
	<p>
		Select a bingo card from an event, or provide your own via JSON.
		<em>
			<a
				href="https://github.com/WesCook/BacklogBingo/tree/main/public/categories/tildes-gaming-nov-2023.json"
				target="_blank"
			>Example Format</a>
		</em>
	</p>

	<div class="card-wrapper">
		<div class="card-event">
			<h3>Event Cards</h3>
			<p>Prebuilt bingo cards from different online events.</p>
			<ul>
				<li>Tildes Gaming Backlog Nov 2023</li>
				<li>Tildes Gaming Backlog May 2024</li>
			</ul>
		</div>

		<div class="card-url">
			<h3>From URL</h3>
			<p>You may download from a URL online.</p>
			<form>
				<input
					type="text"
					placeholder="https://example.com/card.json"
				>
				<button>Fetch</button>
			</form>
		</div>

		<div class="card-file">
			<h3>From File</h3>
			<p>Or upload your own.</p>
			<form>
				<input
					type="file"
				>
			</form>
		</div>
	</div>

	<p>Once the card has been loaded, you may edit your game rules.</p>
	<RouterLink to="gamerules">
		<button>Edit Game Rules</button>
	</RouterLink>
</template>

<style scoped>
	/* Layout */
	.card-wrapper {
		display: grid;
		grid-template-areas:
			"card-event card-url"
			"card-event card-file";
		& > div {
			padding: 20px;
		}
	}

	/* Column view on mobile */
	@media (max-width: 700px) {
		.card-wrapper {
			grid-template-areas:
				"card-event"
				"card-url"
				"card-file";
			row-gap: 1em;
		}
	}

	/* Individual options */
	.card-event {
		grid-area: card-event;
		background-color: var(--tone1);
	}
	.card-url {
		grid-area: card-url;
		background-color: var(--tone3);
	}
	.card-file {
		grid-area: card-file;
		background-color: var(--tone2);
	}
</style>
