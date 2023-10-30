import superOrgan from '../assets/Cards/superOrgan_big.png';
import superHeal from '../assets/Cards/superHeal_big.png';
import superRona from '../assets/Cards/superRona_big.png';

import healBlue from '../assets/Cards/healBlue_big.png';
import ronaBlue from '../assets/Cards/ronaBlue_big.png';
import organBlue from '../assets/Cards/organBlue_big.png';

import healGreen from '../assets/Cards/healGreen_big.png';
import ronaGreen from '../assets/Cards/ronaGreen_big.png';
import organGreen from '../assets/Cards/organGreen_big.png';

import healYellow from '../assets/Cards/healYellow_big.png';
import ronaYellow from '../assets/Cards/ronaYellow_big.png';
import organYellow from '../assets/Cards/organYellow_big.png';

import healRed from '../assets/Cards/healRed_big.png';
import ronaRed from '../assets/Cards/ronaRed_big.png';
import organRed from '../assets/Cards/organRed_big.png';

const cards = [
    {
        tipo: 'órgano',
        color: '#FF0000',
        img: organRed
    },
    {
        tipo: 'órgano',
        color: '#008000',
        img: organGreen
    },
    {
        tipo: 'órgano',
        color: '#FFFF00',
        img: organYellow
    },
    {
        tipo: 'órgano',
        color: '#0000FF',
        img: organBlue
    },
    {
        tipo: 'medicina',
        color: '#FF0000',
        img: healRed
    },
    {
        tipo: 'medicina',
        color: '#008000',
        img: healGreen
    },
    {
        tipo: 'medicina',
        color: '#FFFF00',
        img: healYellow
    },
    {
        tipo: 'medicina',
        color: '#0000FF',
        img: healBlue
    },
    {
        tipo: 'virus',
        color: '#FF0000',
        img: ronaRed
    },
    {
        tipo: 'virus',
        color: '#008000',
        img: ronaGreen
    },
    {
        tipo: 'virus',
        color: '#FFFF00',
        img: ronaYellow
    },
    {
        tipo: 'virus',
        color: '#0000FF',
        img: ronaBlue
    },
    {
        tipo: 'órgano',
        color: '#FFFFFF',
        img: superOrgan
    },
    {
        tipo: 'medicina',
        color: '#FFFFFF',
        img: superHeal
    },
    {
        tipo: 'virus',
        color: '#FFFFFF',
        img: superRona
    }
];

export default cards;