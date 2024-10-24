import { Application } from 'pixi.js';
import { assert, describe, test } from 'vitest';
import { Viewport } from './viewport';

describe('pixi-viewport', async () =>
{
    const pixiapp = new Application();

    await pixiapp.init();

    test('contructor with default options', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events });

        assert.equal(viewport.screenWidth, window.innerWidth);
        assert.equal(viewport.screenHeight, window.innerHeight);
        assert.equal(viewport.threshold, 5);
        assert.isTrue(viewport.options.passiveWheel);
        assert.isFalse(viewport.options.stopPropagation);
        assert.isNull(viewport.forceHitArea);
        assert.isTrue(viewport.options.passiveWheel);
        assert.isNull(document.body.oncontextmenu);

        viewport.destroy();
    });

    test('contructor with passed options', () =>
    {
        const viewport = new Viewport(
            {
                screenWidth: 100,
                screenHeight: 101,
                worldWidth: 1000,
                worldHeight: 1001,
                threshold: 10,
                passiveWheel: false,
                stopPropagation: true,
                noTicker: true,
                disableOnContextMenu: true,
                events: pixiapp.renderer.events
            });

        assert.equal(viewport.screenWidth, 100);
        assert.equal(viewport.screenHeight, 101);
        assert.equal(viewport.worldWidth, 1000);
        assert.equal(viewport.worldHeight, 1001);
        assert.equal(viewport.threshold, 10);
        assert.isFalse(viewport.options.passiveWheel);
        assert.isTrue(viewport.options.stopPropagation);
        viewport.destroy();
    });

    test('resize() should change screen and world sizes', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events });

        viewport.resize(101, 102, 10000, 10001);
        assert.equal(viewport.screenWidth, 101);
        assert.equal(viewport.screenHeight, 102);
        assert.equal(viewport.worldWidth, 10000);
        assert.equal(viewport.worldHeight, 10001);
        viewport.destroy();
    });

    test('getVisibleBounds() and moveCorner()', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events });

        viewport.resize(101, 102);
        viewport.moveCorner(10, 11);
        const bounds = viewport.getVisibleBounds();

        assert.equal(bounds.x, 10);
        assert.equal(bounds.y, 11);
        assert.equal(bounds.width, 101);
        assert.equal(bounds.height, 102);
        viewport.destroy();
    });

    test('zoom() and center', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events });

        viewport.resize(100, 200);
        viewport.zoom(100, true);
        assert.equal(viewport.center.x, 50);
        assert.equal(viewport.center.y, 100);
        viewport.destroy();
    });

    test('worldScreenWidth and worldScreenHeight', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events });

        viewport.resize(200, 300, 1000, 1000);
        assert.equal(viewport.worldScreenWidth, 200);
        assert.equal(viewport.worldScreenHeight, 300);
        viewport.fitWidth(1000);
        assert.equal(viewport.worldScreenWidth, 1000);
        assert.equal(viewport.worldScreenHeight, 1500);
        viewport.destroy();
    });

    test('toWorld()', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events });

        viewport.resize(200, 300, 1000, 1000);
        viewport.fit();
        const world = viewport.toWorld(50, 60);

        assert.equal(world.x, 250);
        assert.equal(world.y, 300);
        viewport.destroy();
    });

    test('toScreen()', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events });

        viewport.resize(200, 300, 1000, 1000);
        viewport.fit();
        const screen = viewport.toScreen(100, 200);

        assert.equal(screen.x, 20);
        assert.equal(screen.y, 40);
        viewport.destroy();
    });

    test('worldWidth and worldHeight', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events });

        viewport.resize(200, 300, 500, 1000);
        assert.equal(viewport.worldWidth, 500);
        assert.equal(viewport.worldHeight, 1000);
        viewport.destroy();
    });

    test('screenWorldWidth and screenWorldHeight', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events });

        viewport.resize(200, 300, 1000, 1000);
        viewport.fit();
        assert.equal(viewport.screenWorldWidth, 200);
        assert.equal(viewport.screenWorldHeight, 200);
        viewport.destroy();
    });

    test('moveCenter(), top, bottom, left, and right', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events, noTicker: true });

        viewport.resize(200, 300, 1000, 1000);
        viewport.moveCenter(500, 500);
        assert.equal(viewport.top, 350);
        assert.equal(viewport.bottom, 650);
        assert.equal(viewport.left, 400);
        assert.equal(viewport.right, 600);
        viewport.destroy();
    });

    test('moveCorner() and corner', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events, noTicker: true });

        viewport.resize(200, 300, 1000, 1000);
        viewport.moveCorner(11, 12);
        assert.equal(viewport.corner.x, 11);
        assert.equal(viewport.corner.y, 12);
        viewport.destroy();
    });

    test('fitWidth()', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events, noTicker: true });

        viewport.resize(200, 300, 1000, 1000);
        viewport.fitWidth(1000, true);
        assert.equal(viewport.screenWorldWidth, 200);
        assert.equal(viewport.screenWorldHeight, 200);
        assert.equal(viewport.center.x, 100);
        assert.equal(viewport.center.y, 150);
        viewport.fitWidth(500, false, false);
        assert.equal(viewport.center.x, 50);
        assert.equal(viewport.center.y, 150);
        assert.equal(viewport.screenWorldWidth, 400);
        assert.equal(viewport.screenWorldHeight, 200);
        viewport.destroy();
    });

    test('fitHeight()', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events, noTicker: true });

        viewport.resize(200, 300, 1000, 1000);
        viewport.fitHeight(400, true);
        assert.equal(viewport.screenWorldWidth, 750);
        assert.equal(viewport.screenWorldHeight, 750);
        assert.equal(viewport.center.x, 100);
        assert.equal(viewport.center.y, 150);
        viewport.moveCenter(202, 22);
        viewport.fitHeight(800, false, false);
        assert.equal(viewport.center.x, 202);
        assert.equal(viewport.center.y, 44);
        assert.equal(viewport.worldScreenHeight, 800);
        assert.equal(viewport.screenWorldHeight, 375);
        viewport.destroy();
    });

    test('fitWorld()', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events });

        viewport.resize(200, 300, 1000, 1000);
        viewport.fitWorld();
        viewport.moveCorner(0, 0);
        assert.equal(viewport.center.x, 500);
        assert.equal(viewport.center.y, 750);
        assert.equal(viewport.screenWorldWidth, 200);
        assert.equal(viewport.screenWorldHeight, 200);
        viewport.destroy();
    });

    test('pause', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events });

        viewport.pause = true;
        assert.equal(viewport.pause, true);
        viewport.pause = false;
        assert.equal(viewport.pause, false);
        viewport.destroy();
    });

    test('setZoom', () =>
    {
        const viewport = new Viewport({ events: pixiapp.renderer.events });

        viewport.setZoom(5);
        assert.equal(viewport.scale.x, 5);
        assert.equal(viewport.scale.y, 5);
        viewport.destroy();
    });

    test('scaled', () =>
    {
        const viewport = new Viewport({
            events: pixiapp.renderer.events,
            screenWidth: 100,
            screenHeight: 100,
            worldWidth: 1000,
            worldHeight: 1000
        });
        const center = { x: viewport.center.x, y: viewport.center.y };

        assert.equal(viewport.scaled, 1);
        viewport.scaled = 5;
        assert.equal(viewport.scale.x, 5);
        assert.equal(viewport.scale.y, 5);
        assert.equal(viewport.center.x, center.x);
        assert.equal(viewport.center.y, center.y);
        assert.equal(viewport.scaled, 5);
        viewport.destroy();
    });
});
