<template>
	<h1>Home</h1>
	<p>Welcome home.  This page will probably not exist in the future.</p>
	<RouterLink to="/card"><button>Select Card Source</button></RouterLink>
	<RouterLink to="/gamerules"><button>Select Game Rules</button></RouterLink>
	<RouterLink to="/categories"><button>Filter Categories</button></RouterLink>
	<RouterLink to="/bingo"><button>View Bingo Card</button></RouterLink>
</template>

<style scoped>
	button {
		margin-bottom: 10px;
		float: left;
		clear: left;
	}
</style>
