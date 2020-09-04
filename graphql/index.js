module.exports = {
	schema_test:`

		type Product {
			_id: String!
			created_at: String
			updated_at: String
			name: String
			description: String
		}

		type Article {
			_id: String!
			created_at: String
			updated_at: String
			name: String
			description: String
			product: Product
		}


		type Section {
			_id: String!
			created_at: String
			updated_at: String
			position: Int
			depth: Int
			name: String
			description: String
			article: Article
			children:[Section]
		}

		type Query {
			rollDice(numDice: Int!, numSides: Int): [Int],
			emancipate(numDice: Int!, numSides: Int): [Int]
		}
	`

} ;