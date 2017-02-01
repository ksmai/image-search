'use strict';

describe('Query page', function() {
  var injector, scope, element, httpBackend;

  beforeEach(function() {
    injector = angular.injector(['imageSearch', 'ngMock', 'ngMockE2E']);
    injector.invoke(function($rootScope, $compile, $httpBackend) {
      scope = $rootScope.$new();

      $httpBackend.whenGET(/.*\/templates\/.*/i).passThrough();
      httpBackend = $httpBackend;
      element = $compile('<search-page></search-page>')(scope);
      scope.$apply();
    });
  });

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('initializes correctly', function(done) {
    scope.$on('searchCtrl', function() {
      var $inputs = element.find('input[type="text"]');
      var $btns = element.find('button').filter(filterVisible);

      assert.equal($inputs.length, 1);
      assert.equal(nVisImgs(element), 0);
      assert.equal($btns.length, 1);
      done();
    });
  });

  it('sends queries to server and renders the results', function(done) {
    var imgs = [];
    for(let i = 0; i < 10; i++) {
      imgs.push({
        url: `https://www.google.com/${i}.jpg`,
        snippet: String(i),
        context: `https://www.google.com/${i}.html`,
        thumbnail: `https://www.google.com/${i}.bmp`
      });
    }
    httpBackend.expectGET(/\/api\/imagesearch\/.*/).respond(imgs);

    scope.$on('searchCtrl', function() {
      var $input = element.find('input[type="text"]').eq(0);
      assert.isOk( $input );
      $input.val('some random query').trigger('input');

      var $submit = element.find('button').filter(filterVisible).eq(0);
      assert.isOk( $submit );
      assert.equal( nVisImgs(element), 0);

      $submit.trigger('click');
      assert.equal( nVisImgs(element), 1); //ajax loader image

      httpBackend.flush();
      assert.equal( nVisImgs(element), 10);

      for(let img of imgs) {
        let thumbnail = element.find(`img[src="${img.thumbnail}"]`);
        assert.equal(thumbnail.length, 1);
        assert.equal(element.find(`img[src="${img.url}"]`).length, 0);
        thumbnail.trigger('click');
        assert.equal(element.find('modal').filter(filterVisible).length, 1);
        assert.equal(element.find(`img[src="${img.url}"]`).length, 1);
        closeModal(element);
        assert.equal(element.find('modal').filter(filterVisible).length, 0);
        assert.equal(element.find(`img[src="${img.url}"]`)
                            .filter(filterVisible).length, 0);
      }
      done();
    });
  });

  it('can load more images upon request', function(done) {
    var imgs = [];
    for(let i = 0; i < 20; i++) {
      imgs.push({
        thumbnail: `https://www.google.com/thumbnail/${i}.jpg`,
        url: `https://www.google.com/image/${i}.jpg`,
        snippet: `${i}`,
        context: `https://www.google.com/context/${i}`
      });
    }
    httpBackend.expectGET(/\/api\/imagesearch\/.*/)
               .respond(imgs.slice(0, 10));

    scope.$on('searchCtrl', function() {
      assert.equal( nVisImgs(element), 0 );
      element.find('input[type="text"]').eq(0).val('cat').trigger('input');
      element.find('.input-group-btn button').trigger('click');
      assert.equal( nVisImgs(element), 1 );
      httpBackend.flush();
      assert.equal( nVisImgs(element), 10 );

      httpBackend.expectGET(/\/api\/imagesearch\/.*/)
                 .respond(imgs.slice(10));
      element.find('button.btn-block').eq(0).trigger('click');
      assert.equal( nVisImgs(element), 11 );
      httpBackend.flush();
      assert.equal( nVisImgs(element), 20 );

      done();
    });
  });

  it('shows an error message when the search fails', function(done) {
    httpBackend.expectGET(/\/api\/imagesearch\/.*/).respond(404, {});

    scope.$on('searchCtrl', function() {
      element.find('input[type="text"]').eq(0).val('cat').trigger('input');
      element.find('.input-group-btn button').eq(0).trigger('click');
      httpBackend.flush();
      var $modal = element.find('modal').filter(filterVisible).eq(0);
      assert.isOk($modal);
      assert.isOk( $modal.text().match(/error/i) );
      done();
    });
  });
});

function closeModal(element) {
  element.find('button.modal-close')
         .filter(filterVisible)
         .eq(0)
         .trigger('click');
}

function filterVisible() {
  return $(this).closest('.ng-hide').length === 0;
}

function nVisImgs(element) {
  return element.find('img').filter(filterVisible).length;
}
