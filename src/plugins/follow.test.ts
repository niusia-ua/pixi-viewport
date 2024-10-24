import { Application, Container } from 'pixi.js';
import { assert, beforeEach, describe, test } from 'vitest';
import { Viewport } from '../viewport';

describe('follow', async () =>
{
    const pixiapp = new Application();

    await pixiapp.init();

    let viewport: Viewport;
    let target: Container;

    beforeEach(() =>
    {
        viewport = new Viewport({ events: pixiapp.renderer.events, screenWidth: 100, screenHeight: 200 });
        target = { x: 10, y: 11 } as Container;
    });

    test('default options', () =>
    {
        viewport.follow(target);
        const follow = viewport.plugins.get('follow')!;

        assert.equal(follow.options.speed, 0);
        assert.isNull(follow.options.acceleration);
        assert.isNull(follow.options.radius);
        target.x = 20;
        target.y = 21;
        assert.equal(viewport.center.x, 50);
        assert.equal(viewport.center.y, 100);
        requestAnimationFrame(() =>
        {
            assert.equal(viewport.center.x, 20);
            assert.equal(viewport.center.y, 21);
            viewport.destroy();
        });
    });

    test('paused', () =>
    {
        viewport.follow(target);
        viewport.plugins.pause('follow');
        requestAnimationFrame(() =>
        {
            assert.equal(viewport.center.x, 50);
            assert.equal(viewport.center.y, 100);
            viewport.destroy();
        });
    });

    test('speed', () =>
    {
        viewport.follow(target, { speed: 2 });
        requestAnimationFrame(() =>
        {
            assert.isTrue(Math.abs(Math.floor(viewport.center.x) - 49) < 1);
            assert.isTrue(Math.abs(Math.floor(viewport.center.y) - 98) < 1);
        });
        setTimeout(() =>
        {
            assert.equal(viewport.center.x, 10);
            assert.equal(viewport.center.y, 11);
            viewport.destroy();
        }, 1000);
    });

    test('radius', () =>
    {
        viewport.follow(target, { radius: 10, speed: 5 });
        let count = 0;

        viewport.on('frame-end', () =>
        {
            count++;
            if (count === 10)
            {
                assert.equal(Math.floor(viewport.center.x), 29);
                assert.equal(Math.floor(viewport.center.y), 54);
                viewport.moveCenter(15, 15);
                setTimeout(() =>
                {
                    assert.equal(viewport.center.x, 15);
                    assert.equal(viewport.center.y, 15);
                    viewport.destroy();
                }, 1000);
            }
        });
    });

    test('speed and acceleration', () =>
    {
        viewport.follow(target, { acceleration: 0.1, speed: 5 });
        viewport.once('frame-end', () =>
        {
            assert.closeTo(Math.floor(viewport.center.x), 48, 2);
            assert.closeTo(Math.floor(viewport.center.y), 99, 5);
        });
        setTimeout(() =>
        {
            assert.equal(Math.floor(viewport.center.x), 10);
            assert.equal(Math.floor(viewport.center.y), 11);
            viewport.destroy();
        }, 1000);
    });

    test('acceleration to a stop', () =>
    {
        viewport.follow(target, { acceleration: 0.01, speed: 5 });
        setTimeout(() =>
        {
            assert.equal(viewport.center.x, 10);
            assert.equal(viewport.center.y, 11);
            viewport.destroy();
        }, 2000);
    });
});
