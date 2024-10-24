import { Application } from 'pixi.js';
import { assert, beforeEach, describe, test } from 'vitest';
import { Viewport } from '../viewport';

describe('mouseEdges', async () =>
{
    const pixiapp = new Application();

    await pixiapp.init();

    let viewport: Viewport;

    beforeEach(() =>
    {
        viewport = new Viewport({ events: pixiapp.renderer.events, screenWidth: 100, screenHeight: 200 });
    });

    test('default options', () =>
    {
        viewport.mouseEdges({});
        const mouseEdges = viewport.plugins.get('mouse-edges')!;

        assert.isNull(mouseEdges.options.radius);
        assert.isNull(mouseEdges.options.distance);
        assert.isNull(mouseEdges.options.top);
        assert.isNull(mouseEdges.options.bottom);
        assert.isNull(mouseEdges.options.left);
        assert.isNull(mouseEdges.options.right);
        assert.equal(mouseEdges.options.speed, 8);
        assert.isFalse(mouseEdges.options.noDecelerate);
        assert.isFalse(mouseEdges.options.linear);
        assert.isFalse(mouseEdges.options.allowButtons);
        viewport.destroy();
    });

    test('options', () =>
    {
        viewport.mouseEdges({});
        const mouseEdges = viewport.plugins.get('mouse-edges')!;

        assert.isNull(mouseEdges.options.radius);
        assert.isNull(mouseEdges.options.distance);
        assert.isNull(mouseEdges.options.top);
        assert.isNull(mouseEdges.options.bottom);
        assert.isNull(mouseEdges.options.left);
        assert.isNull(mouseEdges.options.right);
        assert.equal(mouseEdges.options.speed, 8);
        assert.isFalse(mouseEdges.options.reverse);
        assert.isFalse(mouseEdges.options.noDecelerate);
        assert.isFalse(mouseEdges.options.linear);
        assert.isFalse(mouseEdges.options.allowButtons);
        viewport.destroy();
    });
});
