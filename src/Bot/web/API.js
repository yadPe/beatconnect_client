// not in use

const express = require('express');
const prettify = require('express-prettify');
const API = express.Router();

module.exports = API.use(prettify({ query: 'pretty' }))
  .get('/', (_req, res) => res.end(this.matchs.map(match => this.template(match)).join('<br/>')))
  .get('/nowPlaying', (req, res) => {
    const { matchId } = req.query;
    const beatmap = this.matchs.map(match => (match.id === matchId ? match.fullBeatmapData : null));
    res.json(beatmap);
  })
  .get('/start', (req, res) => {
    const { matchId } = req.query;
    this.matchs.map(match => (matchId === match.id ? match.start() : null));
    res.redirect('back');
  })
  .get('/kick', (req, res) => {
    const { matchId, player } = req.query;
    this.matchs.map(match => (matchId === match.id ? match.kick(player) : null));
    res.redirect('back');
  })
  .get('/host', (req, res) => {
    const { matchId, player } = req.query;
    this.matchs.map(match => (matchId === match.id ? match.makeHost(player) : null));
    res.redirect('back');
  })
  .get('/autobeat', (req, res) => {
    const { matchId } = req.query;
    this.matchs.map(match => (matchId === match.id ? (match.autoBeat = !match.autoBeat) : null));
    res.redirect('back');
  })
  .get('/newMatch', (req, res) => {
    // not in use
    const { matchName, password } = req.query;
    // const { matchId } = req.query;
    // this.matchs.map(match => matchId === match.id ? match.autoBeat = !match.autoBeat : null)
    res.redirect('back');
  });
