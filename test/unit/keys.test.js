var objpack = require('../..');

describe('Keyed Format', function() {
    var values = {
            first: 1,
            second: 2,
            third: 3,
            other: 'atest',
            something: 'somethingelse',
            obj: {
                one: -1
            },
            deep: {
                num: 10,
                flt: 1.899999976158142,
                ch: 'h',
                deeper: {
                    bytes: [1,2,3,4,5]
                }
            }
        },
        format = '<b(first)b(second)B(third)5s(other)S(something){b(one)}(obj){i(num)f(flt)c(ch){5b(bytes)}(deeper)}(deep)',
        packed = objpack.pack(format, values);

    describe('#unpack()', function() {
        var unpacked = objpack.unpack(format, packed);

        it('should return an object with the correct values', function() {
            expect(unpacked).to.eql(values);
        });
    });

    describe('#calcLength()', function() {
        it('simple formats should return the correct length', function() {
            expect(objpack.calcLength(
                '<b(first)b(second)B(third)5s(other)S(something){b(one)}(obj){i(num)f(flt)c(ch){5b(bytes)}(deeper)}(deep)',
                values
            )).to.equal(37);
        });

        it('huge formats should return the correct length', function() {
            expect(objpack.calcLength(
                '<I(nodeIndex)I(materialIndex)I(sharedFlags){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(minSpawnVelocity){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(maxSpawnVelocity){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(spawnVelocityYaw){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(spawnVelocityPitch){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(horizontalSpread){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(verticalSpread){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(minDuration){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(maxDuration)f(killSphereRadiusSqr){f(x)f(y)f(z)}(gravity)f(scaleMidKeyTime)f(colorMidKeyTime)f(alphaMidKeyTime)f(rotationMidKeyTime)f(scaleMidKeyHoldTime)f(colorMidKeyHoldTime)f(alphaMidKeyHoldTime)f(rotationMidKeyHoldTime){H(trackType)H(trackFlags)I(trackGUID){f(x)f(y)f(z)}(defaultValue){f(x)f(y)f(z)}(refereceValue)I(sequenceDataOffset)}(scale){H(trackType)H(trackFlags)I(trackGUID){f(x)f(y)f(z)}(defaultValue){f(x)f(y)f(z)}(refereceValue)I(sequenceDataOffset)}(rotation)3{H(trackType)H(trackFlags)I(trackGUID){B(b)B(g)B(r)B(a)}(defaultValue){B(b)B(g)B(r)B(a)}(refereceValue)I(sequenceDataOffset)}(color)f(drag)f(minMass)f(maxMass)f(massSizeMultiplier)I(group)I(forceFieldGroup)f(worldForceFieldMassMultiplier)f(noiseAmplitude)f(noiseFrequency)f(noiseSpeed)f(noiseFallOff)I(baseShaderSlot)I(elementCount){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(emissionRate)i(emitterType){{H(trackType)H(trackFlags)I(trackGUID){f(x)f(y)f(z)}(defaultValue){f(x)f(y)f(z)}(refereceValue)I(sequenceDataOffset)}(size){H(trackType)H(trackFlags)I(trackGUID){f(x)f(y)f(z)}(defaultValue){f(x)f(y)f(z)}(refereceValue)I(sequenceDataOffset)}(innerSize){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(sphereRadius){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(innerSphereRadius)}(emitterParams){I(size)I(sectionIndex)I(padding)}(emitterMeshList)i(spawnVelocityType)I(randomizeScale){H(trackType)H(trackFlags)I(trackGUID){f(x)f(y)f(z)}(defaultValue){f(x)f(y)f(z)}(refereceValue)I(sequenceDataOffset)}(scaleMax)I(randomizeRotation){H(trackType)H(trackFlags)I(trackGUID){f(x)f(y)f(z)}(defaultValue){f(x)f(y)f(z)}(refereceValue)I(sequenceDataOffset)}(rotationMax)I(randomizeColor)3{H(trackType)H(trackFlags)I(trackGUID){B(b)B(g)B(r)B(a)}(defaultValue){B(b)B(g)B(r)B(a)}(refereceValue)I(sequenceDataOffset)}(colorMax)I(randomizeAlpha){H(trackType)H(trackFlags)I(trackGUID)h(defaultValue)h(refereceValue)I(sequenceDataOffset)}(squirt)3B(flipbookFrame)B(pad)f(flipbookMidKeyTime)H(flipbookColumnCount)H(flipbookRowCount)f(recipFlipbookColumnCount)f(recipFlipbookRowCount)f(particleBounceValue)f(particleFriction)i(particleLinkIndex)I(particleBounceSpawnMin)I(particleBounceSpawnMax)f(particleBounceSpawnChance)f(particleBounceSpawnEnergy)I(particleDieOnBounce)i(instanceType)f(tailLength){f(x)f(y)f(z)}(instanceDirection)f(instanceOffset)i(yawFunctionCurve){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(yawFunctionCurveAmplitude){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(yawFunctionCurveFrequency)i(pitchFunctionCurve){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(pitchFunctionCurveAmplitude){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(pitchFunctionCurveFrequency)i(speedFunctionCurve){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(speedFunctionCurveAmplitude){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(speedFunctionCurveFrequency)i(sizeFunctionCurve){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(sizeFunctionCurveAmplitude){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(sizeFunctionCurveFrequency)i(alphaFunctionCurve){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(alphaFunctionCurveAmplitude){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(alphaFunctionCurveFrequency)i(colorFunctionCurve){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(colorFunctionCurveAmplitude){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(colorFunctionCurveFrequency)i(rotationFunctionCurve){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(rotationFunctionCurveAmplitude){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(rotationFunctionCurveFrequency)i(horzSpreadFunctionCurve){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(horzSpreadFunctionCurveAmplitude){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(horzSpreadFunctionCurveFrequency)i(vertSpreadFunctionCurve){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(vertSpreadFunctionCurveAmplitude){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(vertSpreadFunctionCurveFrequency){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(inheritedVelocityPercentage){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(overlayOffset)I(flags)I(flags2)i(colorInterpolation)i(sizeInterpolation)i(rotationInterpolation){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(screenSpaceParticleAlphaThreshold){H(trackType)H(trackFlags)I(trackGUID){f(x)f(y)}(defaultValue){f(x)f(y)}(refereceValue)I(sequenceDataOffset)}(screenSpaceParticleTextureTranslation){H(trackType)H(trackFlags)I(trackGUID){f(x)f(y)f(z)}(defaultValue){f(x)f(y)f(z)}(refereceValue)I(sequenceDataOffset)}(screenSpaceParticleTextureRotation){H(trackType)H(trackFlags)I(trackGUID){f(x)f(y)}(defaultValue){f(x)f(y)}(refereceValue)I(sequenceDataOffset)}(screenSpaceParticleTextureScale){I(size)I(sectionIndex)I(padding)}(splineEmissionControlPoints)f(windFactor)i(lodReductionLevel)i(lodCutLevel){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(splineLowerBounds){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(splineUpperBounds)i(particleTrailingLinkIndex)f(percentChanceToUseTrailing){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(trailingLinkedParticleEmissionRate)i(linkedSplatIndex)f(linkedSplatSpawnChange){I(size)I(sectionIndex)I(padding)}(particleModels){I(size)I(sectionIndex)I(padding)}(copiedParticleData)I(preVersion23ModelParticleSystem)i(preVersion23ModelParticleSystemInstanceType)'
            )).to.equal(1496);
        });

        it('medium formats should return the correct length', function() {

            expect(objpack.calcLength(
                '<{I(size)I(sectionIndex)I(padding)}(name)I(shaderFlags)I(flags)I(blendMode)i(priority)I(renderToTextureChannelFlags)f(specularity)f(depthBlendFalloff)B(alphaCutoutThreshold)3B(padding)f(hdrSpecularMultiplier)f(hdrEmissiveMultiplier){I(size)I(sectionIndex)I(padding)}(diffuse){I(size)I(sectionIndex)I(padding)}(decal){I(size)I(sectionIndex)I(padding)}(specular){I(size)I(sectionIndex)I(padding)}(specularExponent)2{I(size)I(sectionIndex)I(padding)}(emissive){I(size)I(sectionIndex)I(padding)}(envio){I(size)I(sectionIndex)I(padding)}(envioMask)2{I(size)I(sectionIndex)I(padding)}(alphaMask){I(size)I(sectionIndex)I(padding)}(normal){I(size)I(sectionIndex)I(padding)}(heightmap){I(size)I(sectionIndex)I(padding)}(lightmap){I(size)I(sectionIndex)I(padding)}(ambientOcclusion)I(materialClass)I(envioOp)2I(emissiveOp)I(specularType){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(parallaxHeight){H(trackType)H(trackFlags)I(trackGUID)f(defaultValue)f(refereceValue)I(sequenceDataOffset)}(motionBlur)'
            )).to.equal(280);
        });
    });
});
