import Nat32 "mo:base/Nat32";
import Trie "mo:base/Trie";
import Option "mo:base/Option";
import List "mo:base/List";
import Text "mo:base/Text";
import Result "mo:base/Result";

actor {

  public type BookId = Nat32;
  public type ReaderId = Nat32;

  public type Book = {
    title: Text;
    author: Text;
    publication_year: Nat32;
    genre: List.List<Text>;
    avibility: Bool;
    book_tags :List.List<Text>;
  };

    public type Reader = {
      name: Text;
      num_of_boooks_borrowed: Nat32;
      borrowed_books_ids: List.List<BookId>;
    };

  private stable var nextBook : BookId = 0;
  private stable var nextUser : ReaderId = 0;
  private stable var books: Trie.Trie<BookId, Book> = Trie.empty();
  private stable var readers: Trie.Trie<ReaderId, Reader> = Trie.empty();

  public func createUser (name: Text): async ReaderId {
    let ReaderId = nextUser;
    nextUser+=1;

    let newUser: Reader = {
        name = name;
        num_of_boooks_borrowed = 0;
        borrowed_books_ids = List.nil<BookId>(); 
    };

    readers:= Trie.replace(
      readers,
      ReaderKey(ReaderId),
      Nat32.equal,
      ?newUser//degerin kendisi de gelebilir, null da gelebilir
    ).0;//bir hsey guncelliyorsansa .0 yazman gerekiyor
    ReaderId;
  };
public func addNewBook (newBook: Book): async BookId {
    let BookId = nextBook;
    nextBook+=1;

    books:= Trie.replace(
      books,
      ReaderKey(BookId),
      Nat32.equal,
      ?newBook//degerin kendisi de gelebilir, null da gelebilir
    ).0;//bir hsey guncelliyorsansa .0 yazman gerekiyor
    BookId;
  };

  public func getUser(id: ReaderId): async ?Reader{ // olmalyada bilir
    let result = Trie.find(
          readers, //nerde bakcaz buna
          ReaderKey(id),
          Nat32.equal
        );
    
    result
  };

  public func getBook(id: BookId): async ?Book{ // olmalyada bilir
    let result = Trie.find(
          books, //nerde bakcaz buna
          BookKey(id),
          Nat32.equal
        );
    
    result
  };

public func borrowBook(readerId: ReaderId, bookId: BookId): async Bool {
    let userOption = Trie.find(readers, ReaderKey(readerId), Nat32.equal);
    let bookOption = Trie.find(books, BookKey(bookId), Nat32.equal);

    switch (userOption, bookOption) {
        case (?user, ?book) {
            if (List.size(user.borrowed_books_ids) >= 5) {
                return false; 
            };

            if (book.avibility) {
                books := Trie.replace(
                    books,
                    BookKey(bookId),
                    Nat32.equal,
                    ?{ book with avibility = false }
                ).0;

                readers := Trie.replace(
                    readers,
                    ReaderKey(readerId),
                    Nat32.equal,
                    ?{
                        user with 
                        num_of_boooks_borrowed = user.num_of_boooks_borrowed + 1;
                        borrowed_books_ids = List.push(bookId, user.borrowed_books_ids); 
                    }
                ).0;

                return true; 
            } else {
                return false;
            };
        };
        case _ {
            return false;
        };
    };
  };

  private func ReaderKey(x: ReaderId): Trie.Key<ReaderId>{
    {hash =x; key=x;}
  };
  private func BookKey(x: BookId): Trie.Key<BookId>{
    {hash =x; key=x;}
  };
};
