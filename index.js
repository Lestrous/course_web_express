import express from 'express';
import bodyParser from 'body-parser';
import { createReadStream } from 'fs';
import crypto from 'crypto';
import http from 'http';
import mongoose from 'mongoose';
import UserModel from './models/User.js';
import request from 'request';
import pug from 'pug';
import puppeteer from 'puppeteer';
import zombie from 'zombie';

const User = UserModel(mongoose);
import appSrc from './app.js';

const app = appSrc(express, bodyParser, createReadStream, crypto, http, mongoose, User, request, pug, puppeteer, zombie);

app.listen(process.env.PORT ?? 4321);