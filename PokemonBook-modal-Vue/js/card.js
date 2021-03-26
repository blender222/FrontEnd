export default {
  props: {
    pokemon: {
      required: true,
      type: Object,
      default: function() {
        return {
          attack: 45,
          defense: 40,
          evolution: [],
          genus: "小鳥寶可夢",
          hp: 40,
          id: '016',
          img: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/016.png',
          name: '波波',
          sp_attack: 35,
          sp_defense: 35,
          speed: 56,
        }
      }
    }
  },
  data: () => ({}),
  methods: {
    showPokemon() {
      this.$emit('button-click');
    }
  },
  template: `
    <div class="col">
      <div class="card">
        <div class="pic">
          <img class="pokemonImg card-img-top" :src="pokemon.img" alt="pokemon">
        </div>
        <div class="card-body">
          <div class="pokemonId">{{pokemon.id}}</div>
          <div class="card-title pokemonName">{{pokemon.name}}</div>
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detailModal" @click="showPokemon">Detail</button>
        </div>
      </div>
    </div>
  `,
  
}