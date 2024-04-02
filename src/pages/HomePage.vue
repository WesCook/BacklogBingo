<template>
	<h1>Home</h1>
	<p>Welcome home.  This page will probably not exist in the future.</p>
	<RouterLink to="/card"><button>Select Bingo Card</button></RouterLink>
	<RouterLink to="/gamerules"><button>Select Game Rules</button></RouterLink>
	<RouterLink to="/categories"><button>Filter Categories</button></RouterLink>
</template>

<style scoped>
	button {
		margin-bottom: 10px;
		float: left;
		clear: left;
	}
</style>
