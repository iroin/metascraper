'use strict'

const { mapValues } = require('lodash')
const snapshot = require('snap-shot')
const kindOf = require('kind-of')
const should = require('should')

const metascraperSpotify = require('metascraper-spotify')

const { isValidUrl } = metascraperSpotify

const createMetascraper = (...args) =>
  require('metascraper')([
    metascraperSpotify(...args),
    require('metascraper-author')(),
    require('metascraper-date')(),
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-lang')(),
    require('metascraper-publisher')(),
    require('metascraper-title')(),
    require('metascraper-url')()
  ])

const spotifyUrls = [
  'https://open.spotify.com/album/7CjakTZxwIF8oixONe6Bpb',
  'https://open.spotify.com/artist/1gR0gsQYfi6joyO1dlp76N',
  'https://open.spotify.com/local/Yasunori+Mitsuda/Chrono+Trigger+OST/A+Shot+of+Crisis/161',
  'https://open.spotify.com/local/Yasunori+Mitsuda/Chrono+Trigger+OST+Disc+2/Ayla%27s+Theme/84',
  'https://open.spotify.com/search/artist%3ADaft+Punk',
  'https://open.spotify.com/track/4XfokvilxHAOQXfnWD9p0Q',
  'https://open.spotify.com/playlist/6jP6EcvAwqNksccDkIe6hX',
  'https://open.spotify.com/user/hitradio%c3%b63',
  'https://open.spotify.com/user/hitradioö63',
  'https://open.spotify.com/user/syknyk/starred',
  'https://open.spotify.com/user/tootallnate',
  'https://open.spotify.com/playlist/0Lt5S4hGarhtZmtz7BNTeX',
  'https://open.spotify.com/user/tootallnate/starred',
  'https://embed.spotify.com/?uri=spotify:track:4XfokvilxHAOQXfnWD9p0Q',
  'https://open.spotify.com/embed/track/5oscsdDQ0NpjsTgpG4bI8S',
  'https://open.spotify.com/track/6YqroNoDYeQAOUMpdmim9M',
  'https://open.spotify.com/album/3tbJ3a9ucUBtqJXYGs9bQg?highlight=spotify:track:6YqroNoDYeQAOUMpdmim9M',
  'https://play.spotify.com/track/4XfokvilxHAOQXfnWD9p0Q',
  'https://open.spotify.com/episode/64TORH3xleuD1wcnFsrH1E'
]

describe('metascraper-spotify', () => {
  describe('options', () => {
    it('keyvOpts', async () => {
      const cache = new Map()
      const metascraper = createMetascraper({ keyvOpts: { store: cache } })

      const metadataOne = await metascraper({
        url: 'https://open.spotify.com/playlist/0Lt5S4hGarhtZmtz7BNTeX'
      })

      should(!!metadataOne.audio).be.true()
      should(cache.size).be.equal(1)

      const metadataTwo = await metascraper({
        url: 'https://open.spotify.com/playlist/1232353464563'
      })

      should(!!metadataTwo.audio).be.false()
      should(cache.size).be.equal(2)
    })
  })

  describe('.isvalidUrl', () => {
    describe('true', () => {
      spotifyUrls.forEach(url => {
        it(url, () => {
          should(isValidUrl(url)).be.true()
        })
      })
    })

    describe('false', () => {
      ;[
        'https://soundcloud.com/beautybrainsp/beauty-brain-swag-bandicoot'
      ].forEach(url => {
        it(url, () => {
          should(isValidUrl(url)).be.false()
        })
      })
    })
  })

  describe('extract metadata', () => {
    spotifyUrls.forEach(url => {
      it(url, async () => {
        const metascraper = createMetascraper()
        const metadata = await metascraper({ url })
        snapshot(mapValues(metadata, kindOf))
      })
    })
  })
})
