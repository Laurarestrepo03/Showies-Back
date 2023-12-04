/* eslint-disable prettier/prettier */

export enum Role {
    ADMIN = "admin",

    GENRE_ADMIN = "genre_admin",
    GENRE_READ = "genre_read",
    GENRE_WRITE = "genre_write",
    GENRE_DELETE = "genre_delete",

    GENRE_SHOW_ADMIN = "genre_show_admin",
    GENRE_SHOW_READ = "genre_show_read",
    GENRE_SHOW_WRITE = "genre_show_write",
    GENRE_SHOW_DELETE = "genre_show_delete",
    
    SHOW_ADMIN = "show_admin",
    SHOW_READ = "show_read",
    SHOW_WRITE = "show_write",
    SHOW_DELETE = "show_delete",

    SHOW_GENRE_ADMIN = "show_genre_admin",
    SHOW_GENRE_READ = "show_genre_read",
    SHOW_GENRE_WRITE = "show_genre_write",
    SHOW_GENRE_DELETE = "show_genre_delete",

    SHOW_WATCHING_ADMIN = "show_watching_admin",
    SHOW_WATCHING_READ = "show_watching_read",

    USER_ADMIN = "user_admin",
    USER_READ = "user_read",
    USER_WRITE = "user_write",
    USER_DELETE = "user_delete",

    USER_WATCHING_ADMIN = "user_watching_admin",
    USER_WATCHING_READ = "user_watching_read",

    WATCHING_ADMIN = "watching_admin",
    WATCHING_READ = "watching_read",
    WATCHING_WRITE = "watching_write",
    WATCHING_DELETE =  "watching_delete"
}