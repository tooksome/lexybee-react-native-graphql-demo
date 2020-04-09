import gql                      from 'graphql-tag'

const Fragments = {
  bee_frag: gql`
    fragment bee_frag on Bee {
      letters, datestr, guesses, nogos, nytScore, nytMax, updatedAt, __typename
    }
  `,
}

const Ops = {
  bee_get_qy: gql`
  query bee_get_qy($letters: String!) {
    bee_get(letters: $letters) {
      success
      message
      bee {
        letters
        datestr
        guesses
        nogos
        nytScore
        nytMax
        updatedAt
      }
    }
  }
  `,

  bee_list_qy: gql`
  query bee_list_qy($cursor: String, $sortby: String, $sortRev: Boolean = false) {
    bee_list(limit: 50, cursor: $cursor, sortby: $sortby, sortRev: $sortRev) {
      success
      message
      bees { ...bee_frag }
      cursor
    }
  }
  ${Fragments.bee_frag}
  `,

  bee_list_ids_qy: gql`
  query bee_list_qy($cursor: String, $sortby: String, $sortRev: Boolean = false) {
    bee_list(limit: 100, cursor: $cursor, sortby: $sortby, sortRev: $sortRev) {
      success
      message
      bees {
        letters
        datestr
        nytScore
        nytMax
        updatedAt
      }
      cursor
    }
  }
  `,

  bee_put_mu: gql`
  mutation bee_put_mu(
    $letters:   String!
    $guesses:   [String!]
    $nogos:     [String!]
    $datestr:   String
    $nytScore:  Int
    $nytMax:    Int
  ) {
    bee_put(
      letters:  $letters
      guesses:  $guesses
      nogos:    $nogos
      datestr:  $datestr
      nytScore: $nytScore
      nytMax:   $nytMax
    ) {
      success
      message
      bee { ...bee_frag }
    }
  }
  ${Fragments.bee_frag}
  `,

  bee_del_mu: gql`
  mutation bee_del_mu($letters: String!) {
    bee_del(
      letters: $letters
    ) {
      success
      message
      bee { letters }
    }
  }
  `,
}

export default Ops
