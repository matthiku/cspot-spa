<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Carbon\Carbon;
use Cache;
use Log;

use DOMDocument;
use DOMXPath;
use StdClass;

use Snap\BibleBooks\BibleBooks;

// for our own Bible database
use App\Models\Bibleversion;
use App\Models\Biblebook;
use App\Models\Bible;
use DB;


class BibleController extends Controller
{


    /**
     * Authentication
     */
    public function __construct()
    {
        $this->middleware('auth');
    }


    protected $booksShort = array(
        'genesis' => 'gen',
        'exodus' => 'ex',
        'leviticus' => 'lev',
        'numbers' => 'num',
        'deuteronomy' => 'deut',
        'joshua' => 'josh',
        'judges' => 'jdug',
        'ruth' => 'ruth',
        '1samuel' => '1sam',
        '2samuel' => '2sam',
        '1kings' => '1king',
        '2kings' => '2king',
        '1chronicles' => '1chron',
        '2chronicles' => '2chron',
        'ezra' => 'ezra',
        'nehemiah' => 'neh',
        'esther' => 'est',
        'job' => 'job',
        'psalm' => 'ps',
        'proverbs' => 'prov',
        'ecclesiastes' => 'eccles',
        'song of solomon' => 'song',
        'isaiah' => 'isa',
        'jeremiah' => 'jer',
        'lamentations' => 'lam',
        'ezekiel' => 'ezek',
        'daniel' => 'dan',
        'hosea' => 'hos',
        'joel' => 'joel',
        'amos' => 'amos',
        'obadiah' => 'obad',
        'jonah' => 'jonah',
        'micah' => 'mic',
        'nahum' => 'nah',
        'habakkuk' => 'hab',
        'zephaniah' => 'zeph',
        'haggai' => 'hag',
        'zechariah' => 'zech',
        'malachi' => 'mal',
        'matthew' => 'matt',
        'mark' => 'mark',
        'luke' => 'luke',
        'john' => 'john',
        'acts' => 'acts',
        'romans' => 'rom',
        '1corinthians' => '1cor',
        '2corinthians' => '2cor',
        'galatians' => 'gal',
        'ephesians' => 'eph',
        'philippians' => 'phil',
        'colossians' => 'col',
        '1thessalonians' => '1thess',
        '2thessalonians' => '2thess',
        '1timothy' => '1tim',
        '2timothy' => '2tim',
        'titus' => 'titus',
        'philemon' => 'philem',
        'hebrews' => 'heb',
        'james' => 'james',
        '1peter' => '1pet',
        '2peter' => '2pet',
        '1john' => '1john',
        '2john' => '2john',
        '3john' => '3john',
        'jude' => 'jude',
        'revelation' => 'rev',
    );
    


    /**
     * GetBible
     * 
     * @return object bibleBooks
     */
    protected function getBible()
    {
        return new BibleBooks();
    }





    /**
     * Get list (array) of all books
     *
     * @return array books
     */
    public function books()
    {
        return response()->json($this->getBible()->getArrayOfBooks());
    }



    /**
     * Get number of chapters in a book
     * 
     * @param string $book name of the book
     * 
     * @return number number of chapters
     */
    public function chapters($book)
    {
        return response()->json($this->getBible()->getNumberOfChapters($book));
    }




    /**
     * Get number of chapters in ALL books
     * 
     * @return array number of chapters per book
     */
    public function allChapters()
    {
        $books = $this->getBible()->getArrayOfBooks();

        $chapters = [];
        foreach ($books as $book) {
            $chapters[$book] = $this->getBible()->getNumberOfChapters($book);
        }         

        return response()->json($chapters);
    }




    /**
     * Get number of verses in a chapters of a book
     * 
     * @param string $book    name of the book
     * @param string $chapter chapter
     * 
     * @return number number of verses
     */
    public function verses($book, $chapter)
    {
        return response()->json(
            $this->getBible()->getNumberOfVerses($book, $chapter)
        );
    }




    /**
     * Get number of verses of ALL chapters in ALL books
     * 
     * @return array number of verses
     */ 
    public function allVerses()
    {
        $books = $this->getBible()->getArrayOfBooks();

        $chapters = [];
        foreach ($books as $book) {
            $bookChapters = $this->getBible()->getNumberOfChapters($book);
            $verses = [];
            for ($i=1; $i <= $bookChapters ; $i++) { 
                // code...
                $verses[$i] = $this->getBible()->getNumberOfVerses($book, $i);
            }
            $chapters[$book] = $verses;
        }

        return response()->json($chapters);
    }


    /**
     * Get a website content
     * 
     * @param string $url   address
     * @param string $query (optional) query string
     * 
     * @return string web site content
     */
    protected function getWebsite($url, $query=null)
    {
        $token = env('BIBLES_ORG_API_TOKEN');
        if (!$token) return;

        // Set up cURL
        $ch = curl_init();
        // Set the URL
        curl_setopt($ch, CURLOPT_URL, $url.$query);
        // don't verify SSL certificate
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        // Return the contents of the response as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        // Follow redirects
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        // Set up authentication
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch, CURLOPT_USERPWD, "$token:X");

        // Execute the request
        $response = json_decode(curl_exec($ch));
        curl_close($ch);

        // save passages in cache with an expiration date
        $this->saveToCache($query, $response);

        return $response;
    }


    /**
     * For NIV, use biblehub to get whole chapters
     * 
     * @param string $url     address
     * @param string $book    book
     * @param string $chapter chapter
     *
     * @return string web site content
     */
    protected function getBibleHubText($url, $book, $chapter)
    {
        // Set up cURL
        $ch = curl_init();
        // Set the URL
        $timeout = 5;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        $html = curl_exec($ch);
        curl_close($ch);

        // create a new object to return         
        $p = [];
        $p[0] = new StdClass;
        $p[0]->copyright = '';
        $p[0]->text = '';

        $result = new StdClass;
        $result->passages = $p;
        $search = new StdClass;
        $search->result = $result;
        $response = new StdClass;
        $response->search = $search;
        $rr = new StdClass;
        $rr->response = $response;

        $p[0]->display = $book.' '.$chapter;
        $p[0]->version_abbreviation = 'NIV';

        // return now if for some reason (offline?) the html document could not be received
        if (! $html) return $rr;

        // Create a DOM parser object
        $dom = new DOMDocument;
        libxml_use_internal_errors(true);
        $dom->loadHTML($html);
        $btext = $dom->getElementById('leftbox');

        // unexpected response, return the html code
        if (! $btext) return $html;

        foreach ($btext->getElementsByTagName('div') as $ch) {
            if ($ch->getAttribute('class')=='chap') {
                $p[0]->text = $ch->ownerDocument->saveHTML($ch);
            }
            if ($ch->getAttribute('class')=='padbot') {
                $p[0]->copyright = $ch->ownerDocument->saveHTML($ch);
            }
            if ($ch->getAttribute('class')=='vheading') {
                $p[0]->version_abbreviation = $ch->firstChild->data;
            }
        }

        // save passages in cache with an expiration date
        $this->saveToCache($url, $rr);

        return $rr;
    }


    /**
     * Get scripture text from bibleversion stored in local database
     * 
     * @param string $version_id version
     * @param string $book       book name
     * @param string $chapter    chapter
     * @param string $verseFrom  verse number from
     * @param string $verseTo    verse number to
     * 
     * @return string scripture text
     */
    protected function getLocallyStoredBibletext($version_id, $book, $chapter, $verseFrom, $verseTo)
    {
        // verseTo defaults to the last verse of this chapter
        if (! $verseTo) $verseTo = $this->verses($book, $chapter);

        if ($book=='Psalm')  $book = 'Psalms';

        // create a new object to return (in accordance with other bibletext-acquiring-options)
        $p = [];
        $p[0] = new StdClass;
        $p[0]->text = '';
        $p[0]->display = $book.' '.$chapter.':'.$verseFrom.'-'.$verseTo;

        // find the relvant book id
        $book_id = Biblebook::where('name', $book)->first();
        if ($book_id && $book_id->count()) $book_id = $book_id->id;
        else {        
            $p[0]->copyright = 'Unable to find this bible book: '.$book;
            $p[0]->version_abbreviation = Bibleversion::find($version_id)->name;
            return response()->json($this->createReturnObj($p));
        } 

        // get the actually requested bible text (as a collection)
        $text = Bible::where('bibleversion_id', $version_id)
                     ->where('biblebook_id', $book_id)
                     ->where('chapter', $chapter)
                     ->where('verse', '>=', $verseFrom)
                     ->where('verse', '<=', $verseTo)
                     ->get();

        return response()->json($text);
    }



    /**
     * Save data to cache
     * 
     * @param string $key  string key to identify the data
     * @param string $data string data to be cached
     * 
     * @return void
     */
    protected function saveToCache($key, $data)
    {
        $expiresAt = Carbon::now()->addDays(env('BIBLE_PASSAGES_EXPIRATION_DAYS', 15));
        Cache::put($key, $data, $expiresAt);
    }

    /**
     * Get bible text (whole chapters) via API from bibles.org
     *
     * @param string $version version
     * @param string $book    book name
     * @param string $chapter chapter
     *
     * @return string scripture text
     */
    public function getChapter($version, $book, $chapter)
    {
        // only certain versions are accessible via the API
        $versions = array('NASB', 'ESV', 'MSG', 'AMP', 'CEVUK', 'KJV');
        if (in_array(strtoupper($version), $versions)) {

            // Need to get the abbrev of the book - so change to lowercase and ignore all blanks 
            $book = preg_replace('/\s/', '', strtolower($book));
            if (isset($this->booksShort[$book]))
                $book = $this->booksShort[$book];
            else
                return response()->json("request failed, incorrect book name!", 404);

            $url   = "https://bibles.org/v2/chapters/eng-$version:$book.$chapter/verses.js";
            $query = "$version+$book+$chapter";

            if (Cache::has($query))
                $text = Cache::get($query);
            else {
                $text = $this->getWebsite($url);
                if ($text)
                    $this->saveToCache($query, $text);
            }

            if ($text)
                return response()->json($text->response);
        } 


        /* Alternative:
            https://www.biblegateway.com/passage/?search=1%20Timothy+2&version=NIVUK
        */

        // try biblehub for other translations/versions
        $url  = 'http://biblehub.com/'.strtolower($version).'/'.strtolower($book).'/'.$chapter.'.htm';

        if (Cache::has($url)) {
            $result = Cache::get($url);
        } else {
            $result = $this->getBibleHubText($url, $book, $chapter);
        }

        if ($result) {
            return response()->json($result);
        }

        return response()->json("request failed, no bible text fetched!", 404);
    }


    /**
     * Get bible text (whole passages or single verses) via API from bibles.org
     * 
     * @param string $version   version
     * @param string $book      book name
     * @param string $chapter   chapter
     * @param string $verseFrom verse number from
     * @param string $verseTo   verse number to
     *
     * @return string scripture text
     */
    public function getBibleText($version, $book, $chapter, $verseFrom=1, $verseTo=null)
    {
        // check to see if this version is available in our DB
        $version_id = Bibleversion::where('name', $version)->first();
        if ($version_id) {
            $version_id = $version_id->id;
            return $this->getLocallyStoredBibletext($version_id, $book, $chapter, $verseFrom, $verseTo);
        }

        // only certain versions are accessible via the bibles.org API
        $versions = array('NASB', 'ESV', 'MSG', 'AMP', 'CEVUK', 'KJVA');

        if (in_array($version, $versions)) {
            // create the url and query string
            $book = str_replace(' ', '+', $book);
            $url   = "https://bibles.org/v2/passages.js?q[]=";
            $query = "$book+$chapter:$verseFrom-$verseTo&version=eng-$version";

            // restrieve the passage from the cache, if it exists, otherwise request it again
            if (Cache::has($query)) {
                $result = Cache::get($query);
            } else {
                $result = $this->getWebsite($url, $query);
            }

            if ($result) {
                return response()->json($result);
            }                
        }

        // book name needs to be corrected for use on biblehub.com
        if ($book=='Psalm') $book = 'Psalms';
        $book = str_replace(' ', '_', $book);

        // Try to get other versions via BLB 
        $url  = 'http://biblehub.com/'.strtolower($version).'/'.strtolower($book).'/'.$chapter.'.htm';


        // get result from cache if possible or from requesting the URL
        if (Cache::has($url)) {
            $result = Cache::get($url);
        } else {
            $result = $this->getBibleHubText($url, $book, $chapter);
        }

        // return the bible text if it was a proper result
        if (gettype($result)==='object' && strlen($result->response->search->result->passages[0]->text)) {
            return response()->json($result);
        }

        // create a new object to return (in accordance with other bibletext-acquiring-options)
        $p = [];
        $p[0] = new StdClass;
        $p[0]->copyright = 'bible version '.$version . ' not found!';
        $p[0]->text = "request failed, no bible text fetched!";
        $p[0]->display = $book.' '.$chapter.':'.$verseFrom.'-'.$verseTo;
        $p[0]->version_abbreviation = $version;
        
        return response()->json($this->createReturnObj($p), 404);
    }


    /**
     * Create return object
     * 
     * @param string $pp bible reference
     * 
     * @return string $rr
     */
    protected function createReturnObj($pp)
    {
        $result = new StdClass;
        $result->passages = $pp;
        $search = new StdClass;
        $search->result = $result;
        $response = new StdClass;
        $response->search = $search;

        $rr = new StdClass;        
        $rr->response = $response;
        return $rr;
    }


    /**
     * Update text of a bible verse
     * 
     * @param string $request http request
     * 
     * @return string acknowledgement
     */
    public function apiUpdateBibleText(Request $request)
    {
        // request must contain: version_id, book_id, chapter, verse and actual text
        if ($request->has('value')  && $request->has('id')) {
            $newText = $request->value;
            $fields = explode('-', $request->id);
            if (count($fields)!=5)
                return 'Update failed, invalid number of fields in ID!';

            $text = Bible::where('bibleversion_id', $fields[1])
                         ->where('biblebook_id', $fields[2])
                         ->where('chapter', $fields[3])
                         ->where('verse', $fields[4])
                         ->first();
            if ($text->count())
                $result = DB::update(
                    'update bibles set text=? where bibleversion_id=? and biblebook_id=? and chapter=? and verse=?', 
                    [$newText, $fields[1], $fields[2], $fields[3], $fields[4]]
                );
            else 
                return 'Update failed, verse not found!';

            if ($result==1) {
                // all good, return the new text 
                $text = Bible::where('bibleversion_id', $fields[1])
                             ->where('biblebook_id', $fields[2])
                             ->where('chapter', $fields[3])
                             ->where('verse', $fields[4])
                             ->first();
                return $text->text;
            }
            return 'Update failed, Database update statement returned invalid row count!';
        }
        return 'Update failed, parameters ID or VALUE are missing or both!';
    }


    /**
     * Fulltext Search in bible texts
     * 
     * @param string $request http request
     * 
     * @return string result
     */
    public function apiSearchBibles(Request $request)
    {
        // get search string
        if (! $request->has('search'))
            return 'search string missing';

        $version_id = 1;
        if ($request->has('version'))
            $version_id = $request->version;

        $result = DB::select("SELECT * FROM bibles WHERE match (text) AGAINST ('$request->search') AND bibleversion_id=$version_id LIMIT 25;");

        return response()->json($result);
    }

}

